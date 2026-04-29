import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/overlays.css";
import "./styles/responsive.css";
import { createSpaceScene } from "./scene/scene";
import { worldNodes } from "./scene/content/portfolio-data";
import { hasWebGLSupport, getMotionPreference, isUnsupportedPhoneViewport } from "./ui/accessibility";
import { hideLoadingScreen } from "./ui/loading";
import { bindNodeButtons } from "./ui/nav";
import { createOverlayController } from "./ui/overlays";

const canvas = document.querySelector<HTMLCanvasElement>("#space-canvas");
const panel = document.querySelector<HTMLElement>("#mission-panel");
const panelContent = document.querySelector<HTMLElement>("#panel-content");
const labels = document.querySelector<HTMLElement>(".scene-labels");
const fallback = document.querySelector<HTMLElement>("#webgl-fallback");
const mobileUnsupported = document.querySelector<HTMLElement>("#mobile-unsupported");
const storyNavShell = document.querySelector<HTMLElement>(".story-nav-shell");
const storyNavTrigger = document.querySelector<HTMLButtonElement>(".story-nav-trigger");

if (!canvas || !panel || !panelContent || !labels) {
  throw new Error("Portfolio shell is missing required DOM nodes.");
}

const reducedMotion = getMotionPreference();
const quality = reducedMotion || window.innerWidth < 720 ? "reduced" : "balanced";

if (isUnsupportedPhoneViewport()) {
  document.documentElement.classList.add("mobile-blocked");
  mobileUnsupported?.removeAttribute("hidden");
  hideLoadingScreen();
} else if (!hasWebGLSupport()) {
  fallback?.removeAttribute("hidden");
  hideLoadingScreen();
} else {
  const scene = createSpaceScene(canvas, quality, reducedMotion);
  const overlays = createOverlayController({ panel, content: panelContent, labels });

  overlays.renderLabels(worldNodes, scene.travelTo);
  bindNodeButtons(worldNodes, scene.travelTo);

  scene.onNodeSelected((node) => {
    if (node.panelType) {
      overlays.open(node.panelType);
    } else {
      overlays.close();
    }
    storyNavShell?.classList.remove("is-open");
    storyNavTrigger?.setAttribute("aria-expanded", "false");
  });

  panel.querySelector<HTMLElement>(".panel-close")?.addEventListener("click", overlays.close);
  storyNavTrigger?.addEventListener("click", () => {
    const isOpen = storyNavShell?.classList.toggle("is-open") ?? false;
    storyNavTrigger.setAttribute("aria-expanded", String(isOpen));
  });

  const updateLabels = () => {
    overlays.updateLabelPositions(worldNodes, scene.projectNodeToScreen);
    window.requestAnimationFrame(updateLabels);
  };

  scene.start();
  updateLabels();
  hideLoadingScreen();
}

document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach((anchor) => {
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
});
