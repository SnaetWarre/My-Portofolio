import * as THREE from "three";

type MolecularStrand = THREE.Group & {
  userData: {
    speed: number;
    radius: number;
    phase: number;
  };
};

const palette = ["#89b4ff", "#ffd6a3", "#f7fbff"].map((color) => new THREE.Color(color));

function createBead(color: THREE.Color, radius: number) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 18, 18),
    new THREE.MeshStandardMaterial({
      color: color.clone().multiplyScalar(0.55),
      emissive: color,
      emissiveIntensity: 0.18,
      roughness: 0.42,
      metalness: 0.08,
    }),
  );
}

function createBond(start: THREE.Vector3, end: THREE.Vector3, color: THREE.Color) {
  const direction = end.clone().sub(start);
  const length = direction.length();
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, length, 8),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  mesh.position.copy(start).addScaledVector(direction, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function createStrand(index: number): MolecularStrand {
  const group = new THREE.Group() as MolecularStrand;
  const color = palette[index % palette.length];
  const beadPositions: THREE.Vector3[] = [];
  const beadCount = 9 + (index % 4);

  for (let i = 0; i < beadCount; i += 1) {
    const local = new THREE.Vector3(
      (i - beadCount / 2) * 0.28,
      Math.sin(i * 1.2 + index) * 0.22,
      Math.cos(i * 0.85 + index) * 0.16,
    );
    beadPositions.push(local);
    const bead = createBead(color, i % 3 === 0 ? 0.07 : 0.045);
    bead.position.copy(local);
    group.add(bead);
  }

  for (let i = 1; i < beadPositions.length; i += 1) {
    group.add(createBond(beadPositions[i - 1], beadPositions[i], color));
  }

  const angle = (index / 8) * Math.PI * 2;
  const radius = 10 + (index % 3) * 2.5;
  group.position.set(Math.cos(angle) * radius, THREE.MathUtils.randFloatSpread(7), Math.sin(angle) * radius - 10);
  group.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  group.scale.setScalar(0.9 + Math.random() * 0.65);
  group.userData = {
    speed: 0.06 + Math.random() * 0.09,
    radius,
    phase: angle,
  };
  return group;
}

export function createMolecularField() {
  const group = new THREE.Group();
  const strands: MolecularStrand[] = [];

  for (let i = 0; i < 10; i += 1) {
    const strand = createStrand(i);
    strands.push(strand);
    group.add(strand);
  }

  return {
    group,
    update: (delta: number, elapsed: number) => {
      strands.forEach((strand, index) => {
        const angle = strand.userData.phase + elapsed * strand.userData.speed;
        strand.position.x = Math.cos(angle) * strand.userData.radius;
        strand.position.z = Math.sin(angle) * strand.userData.radius - 9;
        strand.position.y += Math.sin(elapsed * 0.5 + index) * delta * 0.16;
        strand.rotation.x += delta * (0.05 + index * 0.002);
        strand.rotation.y += delta * (0.08 + index * 0.003);
      });
    },
  };
}
