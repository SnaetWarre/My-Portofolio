export function getMotionPreference() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function hasWebGLSupport() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
