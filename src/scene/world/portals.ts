import * as THREE from "three";
import type { WorldNode } from "../content/portfolio-data";

export type HotspotMesh = THREE.Group & {
  userData: {
    node: WorldNode;
    velocity: THREE.Vector3;
    anchor: THREE.Vector3;
    phase: number;
    mass: number;
  };
};

function makeParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(48, 48, 0, 48, 48, 48);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.18, "rgba(255,214,163,0.8)");
  gradient.addColorStop(0.62, "rgba(255,138,61,0.22)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 96, 96);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeOrbitPath(radius: number, color: THREE.Color, opacity: number) {
  return new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.0045, 8, 180),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
}

function makeElectronCloud(radius: number, color: THREE.Color, count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const wobble = Math.sin(i * 12.989) * 0.18;
    positions[i * 3] = Math.cos(angle) * (radius + wobble);
    positions[i * 3 + 1] = Math.sin(angle * 2.0) * 0.08;
    positions[i * 3 + 2] = Math.sin(angle) * (radius + wobble);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color,
    size: 0.035,
    map: makeParticleTexture() ?? undefined,
    transparent: true,
    opacity: 0.74,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geometry, material);
}

export function createPortals(nodes: WorldNode[]) {
  const group = new THREE.Group();
  const orbitalField = new THREE.Group();
  const hotspots: HotspotMesh[] = [];
  const sharedGold = new THREE.Color("#ffd6a3");
  const sharedBlue = new THREE.Color("#89b4ff");

  const shellA = makeOrbitPath(9.6, sharedBlue, 0.12);
  shellA.rotation.x = Math.PI * 0.58;
  const shellB = makeOrbitPath(11.3, sharedGold, 0.1);
  shellB.rotation.x = Math.PI * 0.34;
  shellB.rotation.y = Math.PI * 0.18;
  const shellC = makeOrbitPath(7.6, new THREE.Color("#f7fbff"), 0.07);
  shellC.rotation.z = Math.PI * 0.42;
  orbitalField.add(shellA, shellB, shellC);
  group.add(orbitalField);

  for (const node of nodes) {
    const portal = new THREE.Group() as HotspotMesh;
    const anchor = new THREE.Vector3(...node.position);
    portal.userData.node = node;
    portal.userData.anchor = anchor;
    portal.userData.velocity = new THREE.Vector3(
      -anchor.z * 0.006,
      Math.sin(anchor.x) * 0.008,
      anchor.x * 0.006,
    );
    portal.userData.phase = Math.random() * Math.PI * 2;
    portal.userData.mass = node.id === "identity" ? 3 : 1;
    portal.position.copy(anchor);

    const isCore = node.id === "identity";
    const nodeColor = new THREE.Color(node.accentPalette.glow).lerp(sharedGold, isCore ? 0.35 : 0.55);
    const nucleusRadius = isCore ? 1.58 : 0.16;

    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(nucleusRadius, isCore ? 128 : 48, isCore ? 128 : 48),
      new THREE.MeshStandardMaterial({
        color: isCore ? 0x000000 : 0x070a12,
        emissive: nodeColor,
        emissiveIntensity: isCore ? 0.16 : 0.65,
        roughness: 0.18,
        metalness: 0.28,
      }),
    );
    nucleus.userData.node = node;

    const ringRadius = isCore ? 1.95 : 0.54;
    const ringA = makeOrbitPath(ringRadius, nodeColor, isCore ? 0.34 : 0.52);
    const ringB = makeOrbitPath(ringRadius * (isCore ? 1.32 : 1.38), sharedGold.clone().lerp(nodeColor, 0.35), isCore ? 0.16 : 0.24);
    const ringC = makeOrbitPath(ringRadius * (isCore ? 1.72 : 1.74), sharedBlue.clone().lerp(nodeColor, 0.25), isCore ? 0.09 : 0.16);
    ringA.rotation.x = Math.PI * 0.5;
    ringB.rotation.x = Math.PI * 0.34;
    ringB.rotation.y = Math.PI * 0.26;
    ringC.rotation.x = Math.PI * 0.66;
    ringC.rotation.z = Math.PI * 0.18;

    const electrons = makeElectronCloud(isCore ? 2.15 : 0.7, nodeColor, isCore ? 180 : 56);
    electrons.userData.node = node;

    const hitArea = new THREE.Mesh(
      new THREE.SphereGeometry(isCore ? 2.75 : 0.9, 32, 32),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
    );
    hitArea.userData.node = node;

    portal.add(ringC, ringB, ringA, electrons, nucleus, hitArea);
    group.add(portal);
    hotspots.push(portal);
  }

  return {
    group,
    hotspots,
    update: (delta: number, elapsed: number, camera: THREE.Camera) => {
      orbitalField.rotation.y += delta * 0.035;
      orbitalField.rotation.x = Math.sin(elapsed * 0.16) * 0.12;

      hotspots.forEach((portal, index) => {
        if (portal.userData.node.id !== "identity") {
          const toAnchor = portal.userData.anchor.clone().sub(portal.position).multiplyScalar(0.55);
          const toCore = portal.position.clone().multiplyScalar(-0.018 / Math.max(portal.position.lengthSq(), 1.0));
          const tangent = new THREE.Vector3(-portal.position.z, Math.sin(elapsed + index) * 0.35, portal.position.x)
            .normalize()
            .multiplyScalar(0.23);
          portal.userData.velocity.addScaledVector(toAnchor.add(toCore).add(tangent), delta);
          portal.userData.velocity.multiplyScalar(0.992);
          portal.position.addScaledVector(portal.userData.velocity, delta);
        }

        portal.children[0].rotation.z += delta * (0.34 + index * 0.03);
        portal.children[1].rotation.y -= delta * (0.52 + index * 0.025);
        portal.children[2].rotation.x += delta * (0.42 + index * 0.02);
        portal.children[3].rotation.y += delta * (1.2 + index * 0.08);
        portal.children[3].rotation.z += delta * 0.42;
        portal.children[4].rotation.y += delta * 0.32;
        portal.children[4].scale.setScalar(1 + Math.sin(elapsed * 2.4 + portal.userData.phase) * (portal.userData.node.id === "identity" ? 0.012 : 0.06));

        const labelBias = portal.userData.node.id === "identity" ? 0.04 : 0.22;
        portal.lookAt(camera.position.x * labelBias, camera.position.y * labelBias, camera.position.z * labelBias);
      });
    },
  };
}
