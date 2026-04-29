import * as THREE from "three";

export function addLighting(scene: THREE.Scene) {
  const ambient = new THREE.AmbientLight(0x46506d, 0.105);
  const core = new THREE.PointLight(0xffb36f, 38, 52, 1.35);
  core.position.set(0, 0, 0);

  const blueRim = new THREE.PointLight(0x89b4ff, 3.2, 82, 1.4);
  blueRim.position.set(-10, 7, -12);

  const violetRim = new THREE.PointLight(0x8f63ff, 1.85, 72, 1.6);
  violetRim.position.set(10, -3, -10);

  const asteroidKey = new THREE.DirectionalLight(0xc6d6ff, 0.72);
  asteroidKey.position.set(-8, 5, 12);

  scene.add(ambient, core, blueRim, violetRim, asteroidKey);
  return { ambient, core, blueRim, violetRim, asteroidKey };
}
