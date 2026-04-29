import * as THREE from "three";

export function createDust(count = 900) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color("#6f9fff"),
    new THREE.Color("#8f63ff"),
    new THREE.Color("#ff8a3d"),
    new THREE.Color("#ffcf96"),
    new THREE.Color("#f7fbff"),
  ];

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = THREE.MathUtils.randFloatSpread(52);
    positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(28);
    positions[i * 3 + 2] = THREE.MathUtils.randFloat(-48, 12);

    const color = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.032,
    vertexColors: true,
    transparent: true,
    opacity: count > 1000 ? 0.32 : 0.4,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);

  return {
    group: points,
    update: (delta: number) => {
      points.rotation.y += delta * 0.055;
      points.rotation.x += delta * 0.018;
      points.position.z = Math.sin(performance.now() * 0.00035) * 0.6;
    },
  };
}
