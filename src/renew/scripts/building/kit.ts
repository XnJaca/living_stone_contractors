import * as THREE from 'three';

export type Motion = 'rise' | 'drop' | 'slide' | 'stretch' | 'grow' | 'remove' | 'fade' | 'fadeOut' | 'draw' | 'glow';

export interface PieceOptions {
  t0?: number;
  t1?: number;
  offset?: [number, number, number];
  material?: THREE.Material & { opacity: number };
  /** Peak opacity for fades, or peak emissive intensity for glow. */
  amount?: number;
}

interface Piece extends PieceOptions {
  obj: THREE.Object3D;
  stage: number;
  motion: Motion;
  base: { pos: THREE.Vector3; scale: THREE.Vector3 };
  vec?: THREE.Vector3;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Unit box with its origin at the bottom center, so scale.y raises a part up from its base.
const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);

export function mat(color: THREE.ColorRepresentation, params: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...params });
}

/** Collects the model's parts and the stage each one is built in. */
export class Build {
  readonly group = new THREE.Group();
  private pieces: Piece[] = [];

  box(material: THREE.Material, w: number, h: number, d: number, x: number, y: number, z: number, parent: THREE.Object3D = this.group) {
    const mesh = new THREE.Mesh(UNIT_BOX, material);
    mesh.scale.set(w, h, d);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  /** Line segments from flat [x1,y1,z1,x2,y2,z2,...] coordinates. */
  lines(points: number[], material: THREE.LineBasicMaterial, parent: THREE.Object3D = this.group) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    const line = new THREE.LineSegments(geometry, material);
    parent.add(line);
    return line;
  }

  at<T extends THREE.Object3D>(obj: T, stage: number, motion: Motion, opts: PieceOptions = {}): T {
    this.pieces.push({
      ...opts,
      obj,
      stage,
      motion,
      base: { pos: obj.position.clone(), scale: obj.scale.clone() },
      vec: opts.offset ? new THREE.Vector3(...opts.offset) : undefined,
    });
    return obj;
  }

  /** Spreads objects across a stage window so they land one after another. */
  stagger(objs: THREE.Object3D[], stage: number, motion: Motion, opts: PieceOptions & { span?: number } = {}) {
    const t0 = opts.t0 ?? 0;
    const t1 = opts.t1 ?? 1;
    const span = (opts.span ?? 0.3) * (t1 - t0);
    const n = Math.max(1, objs.length - 1);
    objs.forEach((obj, i) => {
      const start = t0 + ((t1 - t0 - span) * i) / n;
      this.at(obj, stage, motion, { ...opts, t0: start, t1: start + span });
    });
  }

  /** Poses every part for a timeline value P in [0, stages]. */
  apply(P: number) {
    for (const p of this.pieces) {
      const local = clamp01(P - p.stage);
      const t0 = p.t0 ?? 0;
      const t1 = p.t1 ?? 1;
      const q = clamp01((local - t0) / Math.max(0.0001, t1 - t0));
      const e = easeOut(q);
      const { obj, base } = p;
      switch (p.motion) {
        case 'rise':
          obj.visible = q > 0;
          obj.scale.y = base.scale.y * Math.max(0.001, easeInOut(q));
          break;
        case 'stretch':
          obj.visible = q > 0;
          obj.scale.x = base.scale.x * Math.max(0.001, easeInOut(q));
          break;
        case 'drop':
          obj.visible = q > 0;
          obj.position.y = base.pos.y + (1 - e) * 6;
          break;
        case 'slide':
          obj.visible = q > 0;
          obj.position.copy(base.pos).addScaledVector(p.vec!, 1 - e);
          break;
        case 'grow':
          obj.visible = q > 0;
          obj.scale.copy(base.scale).multiplyScalar(Math.max(0.001, e));
          break;
        case 'remove':
          // Only takes over once removal starts, so earlier build motions still apply.
          if (q > 0) {
            obj.visible = q < 1;
            obj.scale.copy(base.scale).multiplyScalar(Math.max(0.001, 1 - easeInOut(q)));
          }
          break;
        case 'fade':
          obj.visible = q > 0;
          p.material!.opacity = e * (p.amount ?? 1);
          break;
        case 'fadeOut':
          if (q > 0) p.material!.opacity = (1 - e) * (p.amount ?? 1);
          if (q >= 1) obj.visible = false;
          break;
        case 'draw': {
          const geo = (obj as unknown as THREE.LineSegments).geometry;
          const count = geo.attributes.position.count;
          obj.visible = q > 0;
          geo.setDrawRange(0, Math.floor((count * easeInOut(q)) / 2) * 2);
          break;
        }
        case 'glow':
          (p.material as THREE.MeshStandardMaterial).emissiveIntensity = e * (p.amount ?? 1);
          break;
      }
    }
  }
}

/** Edges of an axis-aligned box as line-segment coordinates. */
export function boxEdges(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  const c = [
    [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1],
    [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1],
  ];
  const e = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  return e.flatMap(([a, b]) => [...c[a], ...c[b]]);
}
