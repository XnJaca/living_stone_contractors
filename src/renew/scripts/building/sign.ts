import * as THREE from 'three';

export interface SignInfo {
  logo: HTMLImageElement;
  phone: string;
  licenses: string;
}

const FONT = '"Montserrat Variable", Montserrat, sans-serif';

/** Job-site sign face: logo, services, and a green band with phone and licenses. */
export function signTexture({ logo, phone, licenses }: SignInfo) {
  const W = 1200;
  const H = 600;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#fcf9f3';
  ctx.fillRect(0, 0, W, H);

  const logoW = 560;
  const logoH = (logoW * logo.naturalHeight) / logo.naturalWidth;
  ctx.drawImage(logo, 60, 70, logoW, logoH);

  ctx.fillStyle = '#1f2117';
  ctx.fillRect(680, 80, 3, 270);
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 46px ${FONT}`;
  ctx.fillText('Commercial', 720, 165);
  ctx.fillText('Renovations', 720, 220);
  ctx.fillStyle = '#5a7841';
  ctx.font = `600 34px ${FONT}`;
  ctx.fillText('Home Remodeling', 720, 290);
  ctx.fillText('& Improvement', 720, 335);

  // One shade darker than the brand green so it reads true under the scene lighting.
  ctx.fillStyle = '#5a7841';
  ctx.fillRect(0, H - 170, W, 170);
  ctx.fillStyle = '#fcf9f3';
  ctx.font = `700 64px ${FONT}`;
  ctx.fillText(phone, 60, H - 62);
  ctx.font = `600 26px ${FONT}`;
  ctx.textAlign = 'right';
  ctx.fillText(licenses, W - 60, H - 108);
  ctx.fillText('Licensed & insured', W - 60, H - 62);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Sign board on two posts; returns the group, origin at ground level. */
export function siteSign(info: SignInfo) {
  const group = new THREE.Group();
  const post = new THREE.MeshStandardMaterial({ color: 0x2b2d27, roughness: 0.6, metalness: 0.4 });
  const back = new THREE.MeshStandardMaterial({ color: 0x1f2117, roughness: 0.7 });
  const face = new THREE.MeshStandardMaterial({ map: signTexture(info), roughness: 0.65 });

  const BW = 5.2;
  const BH = 2.6;
  const LIFT = 1.4;

  for (const x of [-BW * 0.36, BW * 0.36]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.16, LIFT + BH, 0.16), post);
    p.position.set(x, (LIFT + BH) / 2, -0.12);
    p.castShadow = true;
    group.add(p);
  }
  // Board: printed face on the front, dark edges and back.
  const board = new THREE.Mesh(new THREE.BoxGeometry(BW, BH, 0.1), [back, back, back, back, face, back]);
  board.position.set(0, LIFT + BH / 2, 0);
  board.castShadow = true;
  board.receiveShadow = true;
  group.add(board);
  return group;
}
