import * as THREE from "three";
import type { QualityMode } from "../renderer";

type AsteroidMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> & {
  userData: {
    anchor: THREE.Vector3;
    orbitRadius: number;
    orbitSpeed: number;
    phase: number;
    bobSpeed: number;
    bobAmount: number;
    spin: THREE.Vector3;
  };
};

function seeded(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function distortGeometry(radius: number, seed: number, detail: number) {
  const random = seeded(seed);
  const geometry = new THREE.IcosahedronGeometry(radius, detail);
  const position = geometry.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < position.count; i += 1) {
    vertex.fromBufferAttribute(position, i).normalize();
    const ridge = Math.sin(vertex.x * 11.3 + seed) * Math.cos(vertex.y * 8.7 - seed * 0.4);
    const chip = random() > 0.72 ? 0.68 + random() * 0.18 : 1;
    const displacement = THREE.MathUtils.clamp(0.78 + random() * 0.42 + ridge * 0.12, 0.58, 1.32) * chip;
    vertex.multiplyScalar(radius * displacement);
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createAsteroid(index: number, count: number, material: THREE.MeshStandardMaterial): AsteroidMesh {
  const random = seeded(9203 + index * 811);
  const isLarge = index < Math.max(3, Math.floor(count * 0.22));
  const radius = isLarge ? 0.72 + random() * 0.82 : 0.18 + random() * 0.42;
  const geometry = distortGeometry(radius, 1301 + index * 37, isLarge ? 2 : 1);
  const mesh = new THREE.Mesh(geometry, material) as unknown as AsteroidMesh;

  const side = random() > 0.5 ? 1 : -1;
  const spread = isLarge ? 16 + random() * 14 : 8 + random() * 24;
  const y = (random() - 0.5) * 10 * (isLarge ? 0.8 : 1);
  const z = -32 + random() * 40;
  const anchor = new THREE.Vector3(side * spread, y, z);

  if (Math.abs(anchor.x) < 7 && anchor.z > -10) {
    anchor.x += side * 8;
    anchor.z -= 8;
  }

  mesh.position.copy(anchor);
  mesh.rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI);
  mesh.userData = {
    anchor,
    orbitRadius: 0.28 + random() * (isLarge ? 0.8 : 1.5),
    orbitSpeed: (0.018 + random() * 0.032) * (random() > 0.5 ? 1 : -1),
    phase: random() * Math.PI * 2,
    bobSpeed: 0.12 + random() * 0.22,
    bobAmount: 0.12 + random() * 0.38,
    spin: new THREE.Vector3(
      (0.035 + random() * 0.07) * (random() > 0.5 ? 1 : -1),
      (0.03 + random() * 0.08) * (random() > 0.5 ? 1 : -1),
      (0.018 + random() * 0.05) * (random() > 0.5 ? 1 : -1),
    ),
  };
  return mesh;
}

export function createAsteroids(quality: QualityMode) {
  const group = new THREE.Group();
  const count = quality === "balanced" ? 10 : 22;
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#1b1816"),
    emissive: new THREE.Color("#050404"),
    roughness: 0.92,
    metalness: 0.04,
    flatShading: true,
  });
  const asteroids: AsteroidMesh[] = [];

  for (let i = 0; i < count; i += 1) {
    const asteroid = createAsteroid(i, count, material);
    asteroids.push(asteroid);
    group.add(asteroid);
  }

  return {
    group,
    update: (delta: number, elapsed: number) => {
      asteroids.forEach((asteroid) => {
        const data = asteroid.userData;
        const orbit = data.phase + elapsed * data.orbitSpeed;
        asteroid.position.set(
          data.anchor.x + Math.cos(orbit) * data.orbitRadius,
          data.anchor.y + Math.sin(elapsed * data.bobSpeed + data.phase) * data.bobAmount,
          data.anchor.z + Math.sin(orbit) * data.orbitRadius,
        );
        asteroid.rotation.x += delta * data.spin.x;
        asteroid.rotation.y += delta * data.spin.y;
        asteroid.rotation.z += delta * data.spin.z;
      });
    },
  };
}
