import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/overlays.css";
import "./styles/responsive.css";
import { createSpaceScene } from "./scene/scene";
import { worldNodes } from "./scene/content/portfolio-data";
import { hasWebGLSupport, getMotionPreference } from "./ui/accessibility";
import { hideLoadingScreen } from "./ui/loading";
import { bindNodeButtons } from "./ui/nav";
import { createOverlayController } from "./ui/overlays";

const canvas = document.querySelector<HTMLCanvasElement>("#space-canvas");
const panel = document.querySelector<HTMLElement>("#mission-panel");
const panelContent = document.querySelector<HTMLElement>("#panel-content");
const labels = document.querySelector<HTMLElement>(".scene-labels");
const fallback = document.querySelector<HTMLElement>("#webgl-fallback");

if (!canvas || !panel || !panelContent || !labels) {
  throw new Error("Portfolio shell is missing required DOM nodes.");
}

const reducedMotion = getMotionPreference();
const quality = reducedMotion || window.innerWidth < 720 ? "reduced" : "balanced";

if (!hasWebGLSupport()) {
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
  });

  panel.querySelector<HTMLElement>(".panel-close")?.addEventListener("click", overlays.close);
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
