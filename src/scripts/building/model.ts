import * as THREE from 'three';
import { Build, boxEdges, mat } from './kit';

// Three-story commercial building. Stages:
// 0 site assessment, 1 design & planning, 2 permit & foundation, 3 construction, 4 final inspection.
export const STAGES = 5;

export function buildingModel() {
  const b = new Build();
  const W = 9; // half width (x)
  const D = 5.5; // half depth (z)
  const FLOORS = 3;
  const FH = 3.8;
  const TOP = FLOORS * FH;
  const xs = [-9, -4.5, 0, 4.5, 9];
  const zs = [-5.5, 0, 5.5];

  const concrete = mat(0xd9d4ca, { roughness: 0.95 });
  const deck = mat(0xcbc5b8, { roughness: 0.9 });
  const steel = mat(0x2b2d27, { roughness: 0.55, metalness: 0.4 });
  const ink = mat(0x1f2117, { roughness: 0.6, metalness: 0.2 });
  const panel = mat(0xe8e2d6, { roughness: 0.75 });
  const green = mat(0x6b8f4e, { roughness: 0.6 });

  // Stage 0: site boundary, column grid, and survey stakes ------------------------------
  const survey = new THREE.LineBasicMaterial({ color: 0x5a7841, transparent: true, opacity: 0.9 });
  const corners = [[-17, -12], [17, -12], [17, 13], [-17, 13]];
  const boundary = b.lines(
    corners.flatMap(([x, z], i) => {
      const [nx, nz] = corners[(i + 1) % corners.length];
      return [x, 0.02, z, nx, 0.02, nz];
    }),
    survey,
  );
  b.at(boundary, 0, 'draw', { t0: 0, t1: 0.5 });

  const gridPts: number[] = [];
  for (const x of xs) gridPts.push(x, 0.02, -D - 2.5, x, 0.02, D + 2.5);
  for (const z of zs) gridPts.push(-W - 2.5, 0.02, z, W + 2.5, 0.02, z);
  const grid = b.lines(gridPts, new THREE.LineBasicMaterial({ color: 0x1f2117, transparent: true, opacity: 0.35 }));
  b.at(grid, 0, 'draw', { t0: 0.3, t1: 0.8 });

  const stakes: THREE.Mesh[] = [];
  for (const x of xs) for (const z of zs) stakes.push(b.box(green, 0.12, 0.6, 0.12, x, 0, z));
  b.stagger(stakes, 0, 'rise', { t0: 0.55, t1: 1, span: 0.3 });

  // Stage 1: the design as a line drawing ------------------------------------------------
  const planMat = new THREE.LineBasicMaterial({ color: 0x5a7841, transparent: true, opacity: 0.95 });
  const planPts: number[] = [];
  for (let k = 0; k <= FLOORS; k++) planPts.push(...boxEdges(-W, k * FH, -D, W, k * FH, D).slice(0, 24));
  for (const x of xs) for (const z of zs) planPts.push(x, 0, z, x, TOP, z);
  planPts.push(...boxEdges(-2, 0, -D, 2, TOP + 1.6, -1.5));
  planPts.push(...boxEdges(-W, TOP, -D, W, TOP + 1, D).slice(24));
  const plan = b.lines(planPts, planMat);
  b.at(plan, 1, 'draw', { t0: 0, t1: 0.9 });
  b.at(plan, 4, 'fadeOut', { material: planMat, amount: 0.95, t0: 0, t1: 0.5 });

  // Stage 2: excavation lines, footings, slab on grade, crane erected -----------------------
  const footings: THREE.Mesh[] = [];
  for (const x of xs) for (const z of zs) footings.push(b.box(concrete, 1.0, 0.32, 1.0, x, -0.1, z));
  b.stagger(footings, 2, 'rise', { t0: 0, t1: 0.45, span: 0.25 });
  const slab = b.box(concrete, 2 * W + 0.6, 0.3, 2 * D + 0.6, 0, 0, 0);
  b.at(slab, 2, 'rise', { t0: 0.35, t1: 0.7 });
  b.at(stakes[0], 2, 'remove', { t0: 0, t1: 0.3 });
  stakes.slice(1).forEach((s) => b.at(s, 2, 'remove', { t0: 0, t1: 0.3 }));

  // Tower crane in steel lattice, swinging as the work goes on.
  const crane = new THREE.Group();
  crane.position.set(-14, 0, -7);
  b.group.add(crane);
  const craneMat = new THREE.LineBasicMaterial({ color: 0x1f2117 });
  const MAST = 17;
  const mastPts: number[] = [];
  const m = 0.6;
  for (let y = 0; y < MAST; y += 1.2) {
    mastPts.push(...boxEdges(-m, y, -m, m, y + 1.2, m));
    mastPts.push(-m, y, -m, m, y + 1.2, -m, m, y, m, -m, y + 1.2, m, -m, y, m, -m, y + 1.2, -m, m, y, -m, m, y + 1.2, m);
  }
  b.lines(mastPts, craneMat, crane);
  const jib = new THREE.Group();
  jib.position.y = MAST;
  crane.add(jib);
  const jibPts: number[] = [];
  for (let x = -7; x < 24; x += 1.5) {
    jibPts.push(x, 0, -0.5, x + 1.5, 0, -0.5, x, 0, 0.5, x + 1.5, 0, 0.5, x, 0, -0.5, x + 0.75, 1.2, 0, x + 0.75, 1.2, 0, x + 1.5, 0, 0.5);
    if (x + 1.5 < 24) jibPts.push(x + 0.75, 1.2, 0, x + 2.25, 1.2, 0);
  }
  jibPts.push(0, 0, 0, 0, 4, 0, 0, 4, 0, 22, 1.2, 0, 0, 4, 0, -6, 1.2, 0);
  b.lines(jibPts, craneMat, jib);
  b.box(steel, 2.2, 1.2, 1.4, -6, -1.2, 0, jib);
  b.box(steel, 1.6, 1.6, 1.6, 0, MAST - 1.6, 0, crane);
  b.lines([16, 0, 0, 16, -8, 0], craneMat, jib);
  b.box(green, 0.5, 0.5, 0.5, 16, -8.5, 0, jib);
  b.at(crane, 2, 'rise', { t0: 0.4, t1: 1 });
  b.at(crane, 4, 'remove', { t0: 0.05, t1: 0.35 });

  // Stage 3: core, steel frame, decks, roof ------------------------------------------------
  const core = b.box(concrete, 4, TOP + 1.6, 4, 0, 0.3, -3.5);
  b.at(core, 3, 'rise', { t0: 0, t1: 0.55 });

  const columns: THREE.Mesh[] = [];
  for (const z of zs) for (const x of xs) columns.push(b.box(steel, 0.35, TOP, 0.35, x, 0.3, z));
  b.stagger(columns, 3, 'rise', { t0: 0.02, t1: 0.4, span: 0.4 });

  for (let k = 1; k <= FLOORS; k++) {
    const y = k * FH - 0.45;
    const window0 = 0.2 + (k - 1) * 0.17;
    const beams: THREE.Mesh[] = [];
    for (const z of zs) beams.push(b.box(steel, 2 * W, 0.4, 0.25, 0, y, z));
    b.stagger(beams, 3, 'stretch', { t0: window0, t1: window0 + 0.12, span: 0.6 });
    const girders = xs.map((x) => {
      // Rotated so 'stretch' (scale.x) runs along z.
      const girder = b.box(steel, 2 * D, 0.4, 0.25, x, y, 0);
      girder.rotation.y = Math.PI / 2;
      return girder;
    });
    b.stagger(girders, 3, 'stretch', { t0: window0 + 0.04, t1: window0 + 0.14, span: 0.6 });
    const floor = b.box(deck, 2 * W + 0.4, 0.22, 2 * D + 0.4, 0, k * FH - 0.05, 0);
    b.at(floor, 3, 'drop', { t0: window0 + 0.1, t1: window0 + 0.22 });
  }

  const parapet: THREE.Mesh[] = [
    b.box(panel, 2 * W + 0.4, 1, 0.25, 0, TOP + 0.17, D + 0.08),
    b.box(panel, 2 * W + 0.4, 1, 0.25, 0, TOP + 0.17, -D - 0.08),
    b.box(panel, 0.25, 1, 2 * D + 0.4, W + 0.08, TOP + 0.17, 0),
    b.box(panel, 0.25, 1, 2 * D + 0.4, -W - 0.08, TOP + 0.17, 0),
  ];
  b.stagger(parapet, 3, 'rise', { t0: 0.8, t1: 1, span: 0.5 });

  // Stage 4: curtain wall, spandrels, fins, storefront, rooftop units, site work -------------
  const glass = mat(0x6d8586, {
    roughness: 0.06,
    metalness: 0.35,
    transparent: true,
    opacity: 0.9,
    emissive: 0xffd9a8,
    emissiveIntensity: 0,
    envMapIntensity: 1.4,
  });
  const facade: THREE.Object3D[] = [];
  const faces: { axis: 'x' | 'z'; at: number; from: number; to: number; out: [number, number, number] }[] = [
    { axis: 'x', at: D + 0.2, from: -W, to: W, out: [0, 0, 1.5] },
    { axis: 'z', at: W + 0.2, from: -D, to: D, out: [1.5, 0, 0] },
    { axis: 'x', at: -D - 0.2, from: -W, to: W, out: [0, 0, -1.5] },
    { axis: 'z', at: -W - 0.2, from: -D, to: D, out: [-1.5, 0, 0] },
  ];
  for (let k = 0; k < FLOORS; k++) {
    const y0 = k * FH + (k === 0 ? 0.3 : 0.5);
    const h = FH - (k === 0 ? 0.6 : 0.85);
    for (const f of faces) {
      const len = f.to - f.from;
      const pane = f.axis === 'x' ? b.box(glass, len, h, 0.08, 0, y0, f.at) : b.box(glass, 0.08, h, len, f.at, y0, 0);
      pane.castShadow = false;
      facade.push(pane);
      const band = f.axis === 'x' ? b.box(ink, len + 0.5, 0.6, 0.3, 0, (k + 1) * FH - 0.35, f.at) : b.box(ink, 0.3, 0.6, len + 0.5, f.at, (k + 1) * FH - 0.35, 0);
      facade.push(band);
    }
  }
  // Mullions: slim at every module, deeper at the structural grid.
  const mullion = mat(0x3a3c35, { roughness: 0.5, metalness: 0.5 });
  const fins: THREE.Mesh[] = [];
  for (let x = -W; x <= W + 0.01; x += 2.25) {
    const deep = xs.some((g) => Math.abs(g - x) < 0.01);
    for (const side of [1, -1]) fins.push(b.box(deep ? ink : mullion, deep ? 0.14 : 0.06, TOP - 0.3, deep ? 0.55 : 0.2, x, 0.3, side * (D + (deep ? 0.37 : 0.28))));
  }
  for (let z = -D; z <= D + 0.01; z += 2.75) {
    const deep = zs.some((g) => Math.abs(g - z) < 0.01);
    for (const side of [1, -1]) fins.push(b.box(deep ? ink : mullion, deep ? 0.55 : 0.2, TOP - 0.3, deep ? 0.14 : 0.06, side * (W + (deep ? 0.37 : 0.28)), 0.3, z));
  }

  const faceOut = (o: THREE.Object3D) => {
    const p = o.position;
    if (Math.abs(p.z) > D) return [0, 0, Math.sign(p.z) * 1.5] as [number, number, number];
    return [Math.sign(p.x) * 1.5, 0, 0] as [number, number, number];
  };
  facade.forEach((o, i) => b.at(o, 4, 'slide', { offset: faceOut(o), t0: 0.05 + (i / facade.length) * 0.4, t1: 0.2 + (i / facade.length) * 0.4 }));
  fins.forEach((o, i) => b.at(o, 4, 'rise', { t0: 0.3 + (i / fins.length) * 0.3, t1: 0.42 + (i / fins.length) * 0.3 }));

  const canopy = b.box(green, 6, 0.25, 2.4, 0, 3.4, D + 1.4);
  b.at(canopy, 4, 'stretch', { t0: 0.6, t1: 0.75 });

  const roofUnits: THREE.Mesh[] = [
    b.box(panel, 3, 1.4, 2, 5, TOP + 0.17, 1.5),
    b.box(panel, 2.2, 1.1, 1.6, -5.5, TOP + 0.17, 2),
    b.box(steel, 1.2, 0.8, 1.2, 5.6, TOP + 1.57, 1.5),
  ];
  b.stagger(roofUnits, 4, 'drop', { t0: 0.55, t1: 0.8, span: 0.5 });

  const walk = b.box(mat(0xe6e0d4, { roughness: 0.95 }), 2 * W + 6, 0.12, 4, 0, 0, D + 3);
  b.at(walk, 4, 'rise', { t0: 0.6, t1: 0.8 });
  const stripes: THREE.Mesh[] = [];
  const paint = mat(0xffffff, { roughness: 0.6 });
  for (let x = -12; x <= 12; x += 2.6) stripes.push(b.box(paint, 0.12, 0.02, 4.2, x, 0.01, D + 8));
  b.stagger(stripes, 4, 'stretch', { t0: 0.7, t1: 0.95, span: 0.3 });

  b.at(new THREE.Object3D(), 4, 'glow', { material: glass, amount: 0.12, t0: 0.8, t1: 1 });

  return { build: b, jib, height: TOP };
}
