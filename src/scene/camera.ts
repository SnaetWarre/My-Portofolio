import * as THREE from "three";

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 220);
  camera.position.set(0, 1.25, 15.2);
  camera.lookAt(0, 0, 0);
  return camera;
}
