import * as THREE from "three";

export type QualityMode = "balanced" | "reduced";

export function createRenderer(canvas: HTMLCanvasElement, quality: QualityMode) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: quality === "balanced",
    alpha: false,
    powerPreference: "high-performance",
  });

  renderer.setClearColor(0x00030a, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = quality === "balanced" ? 0.68 : 0.58;

  const maxDpr = quality === "balanced" ? 2 : 1.25;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  return renderer;
}

export function resizeRenderer(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
