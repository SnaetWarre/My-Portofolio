import * as THREE from "three";
import type { QualityMode } from "../renderer";

type AsteroidMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial> & {
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

const asteroidTextureUrl = new URL("../../../asteroid.jpg", import.meta.url).href;

function seeded(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function distortGeometry(radius: number, seed: number, detail: number) {
  const geometry = new THREE.SphereGeometry(radius, detail * 10, detail * 8);
  const position = geometry.attributes.position;
  const vertex = new THREE.Vector3();
  const base = new THREE.Vector3();

  for (let i = 0; i < position.count; i += 1) {
    base.fromBufferAttribute(position, i).normalize();
    const bulk =
      Math.sin(base.x * 2.9 + seed * 0.17) * 0.11 +
      Math.cos(base.y * 3.7 - seed * 0.11) * 0.09 +
      Math.sin(base.z * 4.3 + seed * 0.07) * 0.08;
    const ridges =
      Math.sin((base.x + base.y) * 8.2 + seed * 0.29) * 0.045 +
      Math.cos((base.y - base.z) * 10.1 - seed * 0.21) * 0.035;
    const craterField = Math.max(
      0,
      Math.sin(base.x * 6.1 + seed * 0.31) * Math.cos(base.z * 5.4 - seed * 0.13),
    ) * 0.08;
    const displacement = THREE.MathUtils.clamp(1 + bulk + ridges - craterField, 0.82, 1.24);
    vertex.copy(base).multiplyScalar(radius * displacement);
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function makeTextureVariant(index: number) {
  const texture = new THREE.TextureLoader().load(asteroidTextureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.2 + (index % 3) * 0.22, 1.15 + (index % 4) * 0.18);
  texture.offset.set((index * 0.17) % 1, (index * 0.29) % 1);
  texture.rotation = (index % 5) * 0.37;
  texture.center.set(0.5, 0.5);
  texture.anisotropy = 4;
  return texture;
}

function createMaterial(index: number) {
  const map = makeTextureVariant(index);
  return new THREE.MeshBasicMaterial({
    map,
    color: new THREE.Color(index % 3 === 0 ? "#f2e2c7" : index % 3 === 1 ? "#d2d7dc" : "#dfc19a"),
    fog: false,
  });
}

function createAsteroid(index: number, count: number): AsteroidMesh {
  const random = seeded(9203 + index * 811);
  const isLarge = index < Math.max(3, Math.floor(count * 0.22));
  const radius = isLarge ? 0.78 + random() * 0.74 : 0.26 + random() * 0.48;
  const geometry = distortGeometry(radius, 1301 + index * 37, isLarge ? 3 : 2);
  const material = createMaterial(index);
  const mesh = new THREE.Mesh(geometry, material) as unknown as AsteroidMesh;

  const shellRadius = isLarge ? 14 + random() * 10 : 11 + random() * 20;
  const theta = random() * Math.PI * 2;
  const phi = Math.acos(THREE.MathUtils.clamp(random() * 1.6 - 0.8, -1, 1));
  const anchor = new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta) * shellRadius,
    Math.cos(phi) * shellRadius * 0.72,
    Math.sin(phi) * Math.sin(theta) * shellRadius - 7,
  );

  if (Math.abs(anchor.x) < 8 && Math.abs(anchor.y) < 5 && anchor.z > -14) {
    anchor.x += (anchor.x >= 0 ? 1 : -1) * (8 + random() * 5);
    anchor.y += (anchor.y >= 0 ? 1 : -1) * (2 + random() * 3);
    anchor.z -= 6 + random() * 5;
  }

  mesh.position.copy(anchor);
  mesh.rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI);
  mesh.userData = {
    anchor,
    orbitRadius: 0.32 + random() * (isLarge ? 0.95 : 1.8),
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
  const count = quality === "balanced" ? 14 : 8;
  const asteroids: AsteroidMesh[] = [];

  for (let i = 0; i < count; i += 1) {
    const asteroid = createAsteroid(i, count);
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
