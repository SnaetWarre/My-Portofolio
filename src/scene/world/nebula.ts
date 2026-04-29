import * as THREE from "three";

type NebulaLayer = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

function makeNebulaTexture(primary: string, secondary: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, 512, 512);
  for (let i = 0; i < 18; i += 1) {
    const x = 120 + Math.random() * 280;
    const y = 80 + Math.random() * 360;
    const radius = 90 + Math.random() * 210;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, i % 2 ? primary : secondary);
    gradient.addColorStop(0.22, "rgba(255,255,255,0.018)");
    gradient.addColorStop(0.54, "rgba(12,18,38,0.035)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = 0.045 + Math.random() * 0.085;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const image = ctx.getImageData(0, 0, 512, 512);
  for (let i = 0; i < image.data.length; i += 4) {
    const noise = Math.random() * 10;
    image.data[i] += noise;
    image.data[i + 1] += noise * 0.55;
    image.data[i + 2] += noise * 1.05;
  }
  ctx.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createNebula() {
  const group = new THREE.Group();
  const textureA = makeNebulaTexture("rgba(64,107,185,1)", "rgba(86,58,142,1)");
  const textureB = makeNebulaTexture("rgba(168,93,47,1)", "rgba(80,123,183,1)");

  const configs = [
    {
      position: [0, 0, -34],
      scale: [50, 28, 1],
      rotation: 0,
      texture: textureA,
      opacity: 0.075,
    },
    { position: [-26, 6, -48], scale: [30, 16, 1], rotation: 0.18, texture: textureA, opacity: 0.15 },
    { position: [22, -7, -42], scale: [27, 14, 1], rotation: -0.3, texture: textureB, opacity: 0.14 },
    { position: [5, 18, -60], scale: [40, 19, 1], rotation: 0.55, texture: textureA, opacity: 0.12 },
  ] as const;

  for (const config of configs) {
    const mesh: NebulaLayer = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: config.texture ?? undefined,
        transparent: true,
        opacity: config.opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    );
    mesh.position.set(config.position[0], config.position[1], config.position[2]);
    mesh.scale.set(config.scale[0], config.scale[1], config.scale[2]);
    mesh.rotation.z = config.rotation;
    group.add(mesh);
  }

  return {
    group,
    update: (delta: number) => {
      group.children.forEach((child, index) => {
        child.rotation.z += delta * (index % 2 ? -0.012 : 0.01);
        child.position.x += Math.sin(performance.now() * 0.00014 + index) * delta * 0.11;
      });
    },
  };
}
