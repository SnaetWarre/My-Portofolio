import * as THREE from "three";
import type { NodeId, WorldNode } from "../content/portfolio-data";

export type NavigationState = {
  activeNode: NodeId;
  cameraPosition: THREE.Vector3;
  lookTarget: THREE.Vector3;
  travelProgress: number;
  fromPosition: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toPosition: THREE.Vector3;
  toTarget: THREE.Vector3;
};

const coreDistance = window.innerWidth < 720 ? 18.4 : 15.2;
const corePosition = new THREE.Vector3(0, 1.15, coreDistance);
const coreTarget = new THREE.Vector3(0, 0, 0);

export function createNavigationState(): NavigationState {
  return {
    activeNode: "identity",
    cameraPosition: corePosition.clone(),
    lookTarget: coreTarget.clone(),
    travelProgress: 1,
    fromPosition: corePosition.clone(),
    fromTarget: coreTarget.clone(),
    toPosition: corePosition.clone(),
    toTarget: coreTarget.clone(),
  };
}

export function travelToNode(state: NavigationState, node: WorldNode, currentCamera: THREE.Camera) {
  const target = new THREE.Vector3(...node.cameraTarget);
  const nodePosition = new THREE.Vector3(...node.position);
  const direction = currentCamera.position.clone().sub(nodePosition).normalize();
  const cameraPosition =
    node.id === "identity"
      ? corePosition.clone()
      : nodePosition.clone().add(direction.multiplyScalar(window.innerWidth < 720 ? 6.4 : 4.6)).add(new THREE.Vector3(0, 0.6, 0));

  state.activeNode = node.id;
  state.travelProgress = 0;
  state.fromPosition.copy(currentCamera.position);
  state.fromTarget.copy(state.lookTarget);
  state.toPosition.copy(cameraPosition);
  state.toTarget.copy(node.id === "identity" ? coreTarget : target);
}

export function updateNavigation(
  state: NavigationState,
  camera: THREE.PerspectiveCamera,
  delta: number,
  idleOffset: THREE.Vector3,
) {
  if (state.travelProgress < 1) {
    state.travelProgress = Math.min(1, state.travelProgress + delta * 0.72);
    const eased = easeInOutCubic(state.travelProgress);
    state.cameraPosition.lerpVectors(state.fromPosition, state.toPosition, eased);
    state.lookTarget.lerpVectors(state.fromTarget, state.toTarget, eased);
  }

  camera.position.copy(state.cameraPosition).add(idleOffset);
  camera.lookAt(state.lookTarget);
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}
