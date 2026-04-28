import * as THREE from "three";

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 220);
  const distance = window.innerWidth < 720 ? 18.4 : 15.2;
  camera.position.set(0, 1.15, distance);
  camera.lookAt(0, 0, 0);
  return camera;
}
