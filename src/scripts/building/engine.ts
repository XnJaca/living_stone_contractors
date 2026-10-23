import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { STAGES, buildingModel } from './model';
import type { SignInfo } from './sign';

export interface BuildingScene {
  setProgress(P: number): void;
  dispose(): void;
}

/** Renders the building and eases it toward the scroll position. */
export function createBuildingScene(canvas: HTMLCanvasElement, host: HTMLElement, sign?: SignInfo): BuildingScene {
  const small = window.matchMedia('(max-width: 767px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.75 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;

  scene.add(new THREE.HemisphereLight(0xfffaf0, 0xb8b0a0, 0.95));
  const sun = new THREE.DirectionalLight(0xfff3e2, 2.2);
  sun.position.set(-18, 30, 22);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(small ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 90 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 5;
  scene.add(sun);

  // Ground only catches shadows, so the model sits directly on the page background.
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), new THREE.ShadowMaterial({ opacity: 0.13 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const { build, jib, height } = buildingModel(sign);
  scene.add(build.group);

  const camera = new THREE.PerspectiveCamera(28, 1, 0.5, 300);
  const target = new THREE.Vector3(-1.5, height * 0.62, 0);

  let goal = 0;
  let P = reduced ? STAGES : 0;
  let needsRender = true;

  function place() {
    const t = P / STAGES;
    const angle = 0.95 - t * 0.5;
    const portrait = camera.aspect < 1;
    const radius = (64 - t * 10) * (portrait ? 1.55 : camera.aspect < 1.3 ? 1.15 : 1);
    const elevation = 0.42 - t * 0.12;
    camera.position.set(
      target.x + Math.sin(angle) * Math.cos(elevation) * radius,
      target.y + Math.sin(elevation) * radius,
      target.z + Math.cos(angle) * Math.cos(elevation) * radius,
    );
    camera.lookAt(target);
    jib.rotation.y = 0.6 - P * 0.35;
  }

  function resize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    needsRender = true;
  }

  let raf = 0;
  let visible = false;
  let last = performance.now();
  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const diff = goal - P;
    if (Math.abs(diff) > 0.0005) {
      P = reduced ? goal : P + diff * Math.min(1, dt * 6);
      needsRender = true;
    }
    if (needsRender) {
      build.apply(P);
      place();
      renderer.render(scene, camera);
      needsRender = false;
    }
    raf = visible ? requestAnimationFrame(loop) : 0;
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  });
  io.observe(host);
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  return {
    setProgress(value) {
      goal = Math.min(STAGES, Math.max(0, value));
    },
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      renderer.dispose();
    },
  };
}
