import * as THREE from "three";

export function addLighting(scene: THREE.Scene) {
  const ambient = new THREE.AmbientLight(0x526080, 0.16);
  const core = new THREE.PointLight(0xffb36f, 38, 52, 1.35);
  core.position.set(0, 0, 0);

  const blueRim = new THREE.PointLight(0x89b4ff, 3.8, 80, 1.4);
  blueRim.position.set(-10, 7, -12);

  const violetRim = new THREE.PointLight(0x8f63ff, 2.8, 76, 1.6);
  violetRim.position.set(10, -3, -10);

  scene.add(ambient, core, blueRim, violetRim);
  return { ambient, core, blueRim, violetRim };
}
