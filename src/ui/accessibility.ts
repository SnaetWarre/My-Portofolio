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

export function isUnsupportedPhoneViewport() {
  const hasTouchPrimaryInput = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const isPhoneWidth = window.matchMedia?.("(max-width: 767px)").matches ?? window.innerWidth < 768;
  const isPhoneLandscape = window.matchMedia?.("(max-height: 520px)").matches ?? window.innerHeight < 521;

  return hasTouchPrimaryInput && (isPhoneWidth || isPhoneLandscape);
}
