import * as THREE from "three";
import { createCamera } from "./camera";
import { createControls } from "./controls";
import { worldNodes, type WorldNode } from "./content/portfolio-data";
import { createNavigationState, travelToNode, updateNavigation } from "./interaction/navigation";
import { createRaycaster } from "./interaction/raycast";
import { addLighting } from "./lighting";
import { createPostprocessing } from "./postprocessing";
import { createRenderer, resizeRenderer, type QualityMode } from "./renderer";
import { createAsteroids } from "./world/asteroids";
import { createBlackHole } from "./world/blackHole";
import { createDust } from "./world/dust";
import { createNebula } from "./world/nebula";
import { createPortals } from "./world/portals";
import { createStarfield } from "./world/starfield";

export type SpaceScene = {
  nodes: WorldNode[];
  travelTo: (node: WorldNode) => void;
  onNodeSelected: (callback: (node: WorldNode) => void) => void;
  projectNodeToScreen: (node: WorldNode) => { x: number; y: number; visible: boolean };
  start: () => void;
  destroy: () => void;
};

export function createSpaceScene(canvas: HTMLCanvasElement, quality: QualityMode, reducedMotion: boolean): SpaceScene {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000003, quality === "balanced" ? 0.03 : 0.037);

  const renderer = createRenderer(canvas, quality);
  const camera = createCamera();
  const composer = createPostprocessing(renderer, scene, camera, quality);
  const controls = createControls(canvas);
  const navigation = createNavigationState();
  const picker = createRaycaster();
  const clock = new THREE.Clock();
  const listeners = new Set<(node: WorldNode) => void>();

  addLighting(scene);

  const blackHole = createBlackHole();
  const starfield = createStarfieldByQuality(quality);
  const nebula = createNebula();
  const asteroids = createAsteroids(quality);
  const dust = createDust(quality === "balanced" ? 2200 : 720);
  const portals = createPortals(worldNodes);

  scene.add(starfield.group, nebula.group, dust.group, asteroids.group, blackHole.group, portals.group);

  function selectNode(node: WorldNode) {
    const hotspot = portals.hotspots.find((item) => item.userData.node.id === node.id);
    const liveNode = hotspot
      ? {
          ...node,
          position: hotspot.position.toArray() as [number, number, number],
          cameraTarget: hotspot.position.clone().multiplyScalar(0.92).toArray() as [number, number, number],
        }
      : node;
    travelToNode(navigation, liveNode, camera);
    const target = navigation.toTarget;
    const offset = navigation.toPosition.clone().sub(target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    controls.distance = spherical.radius;
    controls.yaw = spherical.theta;
    controls.pitch = spherical.phi - Math.PI / 2;
    listeners.forEach((listener) => listener(node));
  }

  canvas.addEventListener("pointermove", (event) => picker.setPointer(event));
  canvas.addEventListener("click", () => {
    const node = picker.pick(camera, portals.hotspots);
    if (node) selectNode(node);
  });

  window.addEventListener("keydown", (event) => {
    const keys: Record<string, WorldNode["id"]> = {
      "1": "projects",
      "2": "about",
      "3": "blog",
      "4": "cv",
      "5": "contact",
      Escape: "identity",
    };
    const id = keys[event.key];
    const node = worldNodes.find((item) => item.id === id);
    if (node) selectNode(node);
  });

  const onResize = () => {
    resizeRenderer(renderer, camera);
    composer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  let frame = 0;
  let raf = 0;

  function animate() {
    raf = window.requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;

    const idle = new THREE.Vector3();
    if (!reducedMotion) {
      idle.set(Math.sin(elapsed * 0.24) * 0.2, Math.cos(elapsed * 0.18) * 0.12, 0);
      if (navigation.travelProgress >= 1) {
        const orbitOffset = new THREE.Vector3(0, 0, controls.distance).applyEuler(
          new THREE.Euler(controls.pitch, controls.yaw, 0, "YXZ"),
        );
        navigation.cameraPosition.copy(navigation.lookTarget).add(orbitOffset);
        navigation.toPosition.copy(navigation.cameraPosition);
      }
    }

    updateNavigation(navigation, camera, delta, idle);
    blackHole.update(delta, elapsed);
    starfield.update(delta);
    nebula.update(delta);
    asteroids.update(delta, elapsed);
    dust.update(delta);
    portals.update(delta, elapsed, camera);

    composer.render();
    frame += 1;
  }

  return {
    nodes: worldNodes,
    travelTo: selectNode,
    onNodeSelected(callback) {
      listeners.add(callback);
    },
    projectNodeToScreen(node) {
      const hotspot = portals.hotspots.find((item) => item.userData.node.id === node.id);
      const worldPosition = hotspot?.position.clone() ?? new THREE.Vector3(...node.position);
      const position = worldPosition.project(camera);
      return {
        x: (position.x * 0.5 + 0.5) * window.innerWidth,
        y: (-position.y * 0.5 + 0.5) * window.innerHeight,
        visible: position.z < 1 && frame > 3,
      };
    },
    start: animate,
    destroy() {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      composer.dispose();
    },
  };
}

function createStarfieldByQuality(quality: QualityMode) {
  return createStarfield(quality === "balanced" ? 9000 : 2600);
}
