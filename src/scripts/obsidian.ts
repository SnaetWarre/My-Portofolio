import * as THREE from "three";
import { RIB_COUNT, poseFor, seed, type Pose, type PoseContext, type RibTarget } from "./obsidianPoses";

/** A rounded rectangular loop, with a flattened oval cross-section. */
function createRib() {
  const segments = 160;
  const sides = 16;
  const positions: number[] = [];
  const indices: number[] = [];
  const curve = (angle: number) => new THREE.Vector2(
    Math.sign(Math.cos(angle)) * Math.abs(Math.cos(angle)) ** 0.64 * 1.65,
    Math.sign(Math.sin(angle)) * Math.abs(Math.sin(angle)) ** 0.64 * 1.12,
  );
  for (let i = 0; i <= segments; i++) {
    const angle = i / segments * Math.PI * 2;
    const center = curve(angle);
    const tangent = curve(angle + 0.001).sub(curve(angle - 0.001)).normalize();
    const normal = new THREE.Vector2(tangent.y, -tangent.x);
    for (let j = 0; j <= sides; j++) {
      const cross = j / sides * Math.PI * 2;
      positions.push(
        center.x + normal.x * Math.cos(cross) * 0.19,
        Math.sin(cross) * 0.066,
        center.y + normal.y * Math.cos(cross) * 0.19,
      );
      if (i < segments && j < sides) {
        const a = i * (sides + 1) + j;
        const b = a + sides + 1;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Procedural studio lights give the metal long reflections without HDR downloads. */
function studioEnvironment(renderer: THREE.WebGLRenderer, light = false) {
  const studio = new THREE.Scene();
  // The dark studio is not black: a faint ambient glow gives the ribs a body
  // that separates them from the page, under the highlights.
  studio.background = new THREE.Color(light ? 0x777777 : 0x303030);
  const geometry = new THREE.PlaneGeometry(1, 1);
  const materials: THREE.Material[] = [];
  /** A softbox of the given brightness, or a black flag near brightness 0. */
  const add = (x: number, y: number, z: number, width: number, height: number, brightness: number) => {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(brightness, brightness, brightness),
      side: THREE.DoubleSide,
    });
    materials.push(material);
    const panel = new THREE.Mesh(geometry, material);
    panel.position.set(x, y, z);
    panel.scale.set(width, height, 1);
    panel.lookAt(0, 0, 0);
    studio.add(panel);
  };
  if (light) {
    // Broad softboxes reveal volume; black flags and a dark floor give the
    // chrome something to reflect besides white, especially below each rib.
    add(-4, 4, 3, 5, 7, 5);
    add(2, 5, 0, 6, 4, 5);
    add(4, 1, -3, 1.2, 8, 5);
    add(1, -4, 1, 12, 12, 0.03);
    add(4, 0, 4, 3, 7, 0.03);
  } else {
    // Wide dim softboxes, some at eye level where the rims of the ribs look,
    // turn the ribs into readable volumes. The narrow hot strips on top of
    // them keep the sharp chrome highlights, and a black floor adds contrast.
    add(-4, 3, 3, 5, 8, 0.6);
    add(0, 5, 1, 8, 5, 0.4);
    add(-5, 0, 2.5, 4, 3.5, 0.5);
    add(4.5, -0.5, 2.5, 3, 4, 0.22);
    add(1, -4, 2, 12, 12, 0.01);
    add(-4.5, 2, 3.5, 0.9, 7, 6);
    add(4, 1, -2, 1.2, 9, 5);
  }
  const generator = new THREE.PMREMGenerator(renderer);
  const target = generator.fromScene(studio, 0.025);
  geometry.dispose();
  materials.forEach((material) => material.dispose());
  generator.dispose();
  return target;
}

const newTarget = (): RibTarget => ({
  position: new THREE.Vector3(),
  quaternion: new THREE.Quaternion(),
  scale: new THREE.Vector3(1, 1, 1),
  opacity: 1,
});

export function mountObsidian(canvas: HTMLCanvasElement) {
  // Keep a deterministic frame available for regenerating the social preview.
  const captureMode = new URLSearchParams(window.location.search).has("social-capture");
  // No 3D sculpture on phones, in dark or light mode. Bail before creating
  // a WebGL context so mobile never pays the GPU / download cost.
  // (ObsidianScene.astro already skips the import; this is defense in depth
  // for direct mounts and Astro view-transition re-mounts.)
  const phoneQuery = window.matchMedia("(max-width: 700px)");
  if (phoneQuery.matches && !captureMode) {
    canvas.dataset.state = "unavailable";
    return;
  }
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
      preserveDrawingBuffer: captureMode,
    });
  } catch {
    canvas.dataset.state = "unavailable";
    return;
  }
  renderer.setClearColor(0x000000, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  const environments: Partial<Record<"light" | "dark", THREE.WebGLRenderTarget>> = {};
  const systemAppearance = matchMedia("(prefers-color-scheme: dark)");
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  camera.position.set(0, 0, 11);
  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const geometry = createRib();
  // One material per rib, so a pose can fade single ribs. They share a shader.
  // All are flagged transparent up front: a fully opaque rib still writes
  // depth, and no shader has to be rebuilt when one starts to fade.
  const ribs = Array.from({ length: RIB_COUNT }, () => {
    const material = new THREE.MeshPhysicalMaterial({ metalness: 1, transparent: true });
    const rib = new THREE.Mesh(geometry, material);
    sculpture.add(rib);
    return rib;
  });
  const caption = canvas.parentElement?.querySelector<HTMLElement>("[data-obsidian-caption]");

  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  let still = captureMode || motionPreference.matches;
  let frame = 0;
  let last = 0;
  let disposed = false;
  let phoneHidden = false;

  // What the ribs are doing now, and what the active pose asks of them.
  const current = ribs.map(newTarget);
  const wanted = newTarget();
  const context: PoseContext = { progress: 0, time: captureMode ? 2.4 : 0 };
  let pose: Pose = seed;
  let previousPose: Pose = seed;
  /** When the ribs started leaving the previous pose, one after another. */
  let poseChangedAt = -Infinity;
  const ribPose = ribs.map(() => seed);
  const stagger = 0.016;
  const rotation = new THREE.Vector3(...seed.rotation);
  let idle = 0;
  let progressTarget = 0;
  const pointer = new THREE.Vector2();
  const pointerTarget = new THREE.Vector2();

  const readProgress = () => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progressTarget = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
  };

  /** Move everything one step toward the active pose. Returns whether anything is still moving. */
  const advance = (dt: number, now: number) => {
    const ease = (rate: number) => (still ? 1 : 1 - Math.exp(-dt * rate));
    let moving = false;

    pointer.lerp(pointerTarget, ease(4));
    context.progress += (progressTarget - context.progress) * ease(5);
    idle += (pose.idle - idle) * ease(3);
    context.time += dt * idle;
    if (pointer.distanceToSquared(pointerTarget) > 1e-6) moving = true;
    if (Math.abs(progressTarget - context.progress) > 2e-4) moving = true;
    if (idle > 0.002) moving = true;

    // Morph gently right after a page change, then track scrolling closely.
    const sinceChange = (now - poseChangedAt) / 1000;
    const settle = Math.min(1, Math.max(0, (sinceChange - 0.9) / 1.2));
    const follow = ease(4.5 + settle * 8);
    pose.prepare?.(context);
    if (previousPose !== pose) previousPose.prepare?.(context);
    for (let index = 0; index < ribs.length; index++) {
      if (ribPose[index] !== pose) {
        if (still || sinceChange >= index * stagger) ribPose[index] = pose;
        else moving = true;
      }
      const state = current[index];
      ribPose[index].place(index, context, wanted);
      if (
        state.position.distanceToSquared(wanted.position) > 1e-6
        || state.scale.distanceToSquared(wanted.scale) > 1e-6
        || Math.abs(state.opacity - wanted.opacity) > 2e-3
        || state.quaternion.angleTo(wanted.quaternion) > 2e-3
      ) moving = true;
      state.position.lerp(wanted.position, follow);
      state.quaternion.slerp(wanted.quaternion, follow);
      state.scale.lerp(wanted.scale, follow);
      state.opacity += (wanted.opacity - state.opacity) * follow;
    }

    wanted.position.set(
      pose.rotation[0] + pointer.y * 0.14,
      pose.rotation[1] + pointer.x * 0.28 + context.progress * pose.spin,
      pose.rotation[2],
    );
    if (rotation.distanceToSquared(wanted.position) > 1e-6) moving = true;
    rotation.lerp(wanted.position, ease(4.5));
    return moving;
  };

  const draw = () => {
    for (let index = 0; index < ribs.length; index++) {
      const rib = ribs[index];
      const state = current[index];
      const material = rib.material;
      rib.visible = state.opacity > 0.01;
      rib.position.copy(state.position);
      rib.quaternion.copy(state.quaternion);
      rib.scale.copy(state.scale);
      material.opacity = Math.min(1, state.opacity);
      // Faded ribs must not hide the solid ones behind them.
      material.depthWrite = state.opacity > 0.6;
    }
    sculpture.rotation.set(rotation.x, rotation.y, rotation.z);
    // Sit in the space beside the text column, sized so a whole pose fits it.
    // Raised a little so the caption has room underneath.
    const visibleWidth = 2 * Math.tan(THREE.MathUtils.degToRad(18)) * camera.position.z * camera.aspect;
    sculpture.position.set(visibleWidth * 0.265, 0.14, 0);
    sculpture.scale.setScalar(Math.min(1, Math.max(0.55, visibleWidth * 0.39 / 4.4)));
    renderer.render(scene, camera);
  };

  /** The loop only runs while something is changing, so a resting page costs nothing. */
  const animate = (now: number) => {
    frame = 0;
    if (disposed || still || phoneHidden || document.hidden) return;
    const dt = Math.min((now - last) / 1000 || 0, 0.05);
    last = now;
    const moving = advance(dt, now);
    draw();
    if (moving) frame = requestAnimationFrame(animate);
  };
  const start = () => {
    if (!frame && !still && !phoneHidden && !document.hidden && !disposed) {
      last = performance.now();
      frame = requestAnimationFrame(animate);
    }
  };
  /** Without motion, jump straight to the pose and draw it once. */
  const redraw = () => {
    if (phoneHidden || disposed) return;
    if (still) advance(0, performance.now());
    draw();
    start();
  };

  const applyPose = () => {
    const next = poseFor(document.documentElement.dataset.pose);
    if (next !== pose) {
      previousPose = pose;
      pose = next;
      poseChangedAt = performance.now();
    }
    if (caption) {
      const [form, scrolling] = pose.caption ?? [];
      caption.textContent = [form, still ? undefined : scrolling].filter(Boolean).join(" ");
      caption.hidden = !form;
    }
    readProgress();
    if (still) {
      // A still sculpture shows each pose as it is at the top of the page.
      progressTarget = 0;
    }
    redraw();
  };
  const applyAppearance = () => {
    const preference = document.documentElement.dataset.theme;
    const dark = preference === "dark" || (!preference && systemAppearance.matches);
    const theme = dark ? "dark" : "light";
    environments[theme] ??= studioEnvironment(renderer, !dark);
    scene.environment = environments[theme].texture;
    renderer.setClearColor(dark ? 0x000000 : 0xffffff, 1);
    renderer.toneMappingExposure = dark ? 1.1 : 0.95;
    for (const { material } of ribs) {
      material.color.setHex(dark ? 0x8c8c8c : 0x939393);
      material.roughness = dark ? 0.24 : 0.3;
      material.clearcoat = dark ? 0.8 : 0.45;
      material.clearcoatRoughness = dark ? 0.18 : 0.25;
      material.envMapIntensity = dark ? 1.35 : 1.05;
    }
    canvas.dataset.appearance = theme;
    redraw();
  };
  const rootObserver = new MutationObserver((records) => {
    if (records.some((record) => record.attributeName === "data-pose")) applyPose();
    if (records.some((record) => record.attributeName === "data-theme")) applyAppearance();
  });

  const resize = () => {
    phoneHidden = phoneQuery.matches && !captureMode;
    if (phoneHidden) {
      // Desktop -> phone (narrowed window): stop GPU work. CSS already hides
      // the fixed scene container on phones in both themes.
      cancelAnimationFrame(frame);
      frame = 0;
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    readProgress();
    redraw();
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType === "touch" || still) return;
    pointerTarget.set(event.clientX / window.innerWidth * 2 - 1, event.clientY / window.innerHeight * 2 - 1);
    start();
  };
  const onScroll = () => {
    if (still) return;
    readProgress();
    start();
  };
  const visibility = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    start();
  };
  const setStill = (value: boolean) => {
    still = value;
    cancelAnimationFrame(frame);
    frame = 0;
    applyPose();
  };
  const onPreference = () => setStill(motionPreference.matches);
  const onPhoneChange = () => {
    phoneHidden = phoneQuery.matches && !captureMode;
    if (phoneHidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      canvas.dataset.state = "unavailable";
      return;
    }
    applyAppearance();
    resize();
    canvas.dataset.state = "ready";
    start();
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    cancelAnimationFrame(frame);
    frame = 0;
    still = true;
    canvas.dataset.state = "unavailable";
  };
  const contextRestored = () => {
    // PMREM render targets lose their contents with the WebGL context.
    for (const theme of ["light", "dark"] as const) {
      environments[theme]?.dispose();
      delete environments[theme];
    }
    applyAppearance();
    resize();
    canvas.dataset.state = "ready";
    setStill(motionPreference.matches);
  };
  // The page length is only final once the new page has loaded.
  const onPageLoad = () => applyPose();

  current.forEach((state, index) => {
    seed.place(index, context, state);
  });
  applyAppearance();
  resize();
  applyPose();
  rootObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-pose"] });
  systemAppearance.addEventListener("change", applyAppearance);
  canvas.dataset.state = "ready";
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  document.addEventListener("astro:page-load", onPageLoad);
  motionPreference.addEventListener("change", onPreference);
  phoneQuery.addEventListener("change", onPhoneChange);
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    disposed = true;
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", visibility);
    document.removeEventListener("astro:page-load", onPageLoad);
    motionPreference.removeEventListener("change", onPreference);
    phoneQuery.removeEventListener("change", onPhoneChange);
    canvas.removeEventListener("webglcontextlost", contextLost);
    canvas.removeEventListener("webglcontextrestored", contextRestored);
    geometry.dispose();
    ribs.forEach((rib) => rib.material.dispose());
    rootObserver.disconnect();
    systemAppearance.removeEventListener("change", applyAppearance);
    Object.values(environments).forEach((environment) => environment.dispose());
    renderer.dispose();
  });
}
