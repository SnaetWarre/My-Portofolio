import * as THREE from "three";

type ControlState = {
  yaw: number;
  pitch: number;
  distance: number;
  pointer: THREE.Vector2;
  dragging: boolean;
  lastX: number;
  lastY: number;
};

export function createControls(canvas: HTMLCanvasElement) {
  const initialDistance = window.innerWidth < 720 ? 18.4 : 15.2;
  const state: ControlState = {
    yaw: 0,
    pitch: 0.08,
    distance: initialDistance,
    pointer: new THREE.Vector2(),
    dragging: false,
    lastX: 0,
    lastY: 0,
  };

  const onPointerMove = (event: PointerEvent) => {
    state.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    state.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (!state.dragging) return;
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.yaw -= dx * 0.0032;
    state.pitch = THREE.MathUtils.clamp(state.pitch - dy * 0.0024, -0.48, 0.52);
  };

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointerup", (event) => {
    state.dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  });

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      state.distance = THREE.MathUtils.clamp(state.distance + event.deltaY * 0.006, 4.5, 26);
    },
    { passive: false },
  );

  return state;
}
