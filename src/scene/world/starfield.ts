import * as THREE from "three";

function createCircleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.32, "rgba(255,255,255,0.7)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createStarfield(count = 4200) {
  const group = new THREE.Group();
  const texture = createCircleTexture();
  const colors = [new THREE.Color("#f7fbff"), new THREE.Color("#89b4ff"), new THREE.Color("#ffd6a3")];

  for (let layer = 0; layer < 3; layer += 1) {
    const layerCount = Math.floor(count / (layer + 1.25));
    const positions = new Float32Array(layerCount * 3);
    const colorArray = new Float32Array(layerCount * 3);
    const radius = 34 + layer * 36;

    for (let i = 0; i < layerCount; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      const r = radius + Math.random() * 38;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      positions[i * 3 + 2] = Math.cos(phi) * r - 16;

      const color = colors[Math.floor(Math.random() * colors.length)];
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

    const material = new THREE.PointsMaterial({
      size: 0.035 + layer * 0.014,
      map: texture ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.9 - layer * 0.13,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    points.userData.rotationSpeed = 0.014 / (layer + 1);
    group.add(points);
  }

  return {
    group,
    update: (delta: number) => {
      group.children.forEach((child) => {
        child.rotation.y += delta * (child.userData.rotationSpeed ?? 0.01);
        child.rotation.x += delta * 0.0025;
      });
    },
  };
}
