import * as THREE from "three";

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

/** Procedural studio lights give the metal long white reflections without HDR downloads. */
function studioEnvironment(renderer: THREE.WebGLRenderer, light = false) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(light ? 0x777777 : 0x050505);
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 5, 5), side: THREE.DoubleSide });
  const negativeFill = new THREE.MeshBasicMaterial({ color: 0x080808, side: THREE.DoubleSide });
  const add = (x: number, y: number, z: number, width: number, height: number, dark = false) => {
    const panel = new THREE.Mesh(geometry, dark ? negativeFill : material);
    panel.position.set(x, y, z);
    panel.scale.set(width, height, 1);
    panel.lookAt(0, 0, 0);
    studio.add(panel);
  };
  if (light) {
    // Broad softboxes reveal volume; black flags and a dark floor give the
    // chrome something to reflect besides white, especially below each rib.
    add(-4, 4, 3, 5, 7);
    add(2, 5, 0, 6, 4);
    add(4, 1, -3, 1.2, 8);
    add(1, -4, 1, 12, 12, true);
    add(4, 0, 4, 3, 7, true);
  } else {
    add(-4, 3, 3, 2, 8);
    add(4, 1, -2, 1.5, 9);
    add(0, 5, 1, 5, 2);
    add(1, -3, 4, 4, 0.4);
  }
  const generator = new THREE.PMREMGenerator(renderer);
  const target = generator.fromScene(studio, 0.025);
  geometry.dispose();
  material.dispose();
  negativeFill.dispose();
  generator.dispose();
  return target;
}

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
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x555555,
    metalness: 1,
    roughness: 0.21,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.7,
  });
  const ribs = Array.from({ length: 32 }, (_, i) => {
    const rib = new THREE.Mesh(geometry, material);
    rib.userData.level = (i - 15.5) / 15.5;
    sculpture.add(rib);
    return rib;
  });
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = captureMode || motionPreference.matches;
  let frame = 0;
  let last = 0;
  let elapsed = captureMode ? 2.4 : 0;
  let scroll = 0;
  let scrollTarget = window.scrollY / window.innerHeight;
  const pointer = new THREE.Vector2();
  const pointerTarget = new THREE.Vector2();
  let mobile = false;
  let disposed = false;
  let phoneHidden = false;

  const draw = () => {
    const unfold = Math.min(scroll, 3) * 0.16;
    for (const rib of ribs) {
      const t = rib.userData.level as number;
      rib.position.set(Math.sin(t * 2.1 + elapsed * 0.12) * 0.36, t * (2.7 + unfold), 0);
      rib.rotation.y = t * (0.92 + unfold * 0.6) + elapsed * 0.055;
      const scale = 0.85 + 0.16 * Math.cos(t * 2.8);
      rib.scale.set(scale, 1, scale);
    }
    sculpture.rotation.set(0.24 + pointer.y * 0.13, 0.35 + pointer.x * 0.24 + scroll * 0.13, -0.32);
    const visibleWidth = 2 * Math.tan(THREE.MathUtils.degToRad(18)) * camera.position.z * camera.aspect;
    sculpture.position.set(mobile ? visibleWidth * 0.2 : visibleWidth * 0.245, -0.1, 0);
    sculpture.scale.setScalar(mobile ? 0.85 : 1.2);
    renderer.render(scene, camera);
  };
  const applyAppearance = () => {
    const preference = document.documentElement.dataset.theme;
    const dark = preference === "dark" || (!preference && systemAppearance.matches);
    const theme = dark ? "dark" : "light";
    environments[theme] ??= studioEnvironment(renderer, !dark);
    scene.environment = environments[theme].texture;
    renderer.setClearColor(dark ? 0x000000 : 0xffffff, 1);
    renderer.toneMappingExposure = dark ? 1.15 : 0.95;
    material.color.setHex(dark ? 0x555555 : 0x939393);
    material.roughness = dark ? 0.21 : 0.3;
    material.clearcoat = dark ? 1 : 0.45;
    material.clearcoatRoughness = dark ? 0.15 : 0.25;
    material.envMapIntensity = dark ? 1.7 : 1.05;
    canvas.dataset.appearance = theme;
    // Also redraw a paused or reduced-motion scene when its appearance changes.
    draw();
  };
  const appearanceObserver = new MutationObserver(applyAppearance);
  const animate = (now: number) => {
    frame = 0;
    if (disposed || paused || phoneHidden || document.hidden) return;
    const dt = Math.min((now - last) / 1000 || 0, 0.05);
    last = now;
    elapsed += dt;
    const ease = 1 - Math.exp(-dt * 4);
    pointer.lerp(pointerTarget, ease);
    scroll += (scrollTarget - scroll) * ease;
    draw();
    frame = requestAnimationFrame(animate);
  };
  const start = () => {
    if (!frame && !paused && !phoneHidden && !document.hidden && !disposed) {
      last = performance.now();
      frame = requestAnimationFrame(animate);
    }
  };
  const resize = () => {
    mobile = window.innerWidth <= 700;
    phoneHidden = phoneQuery.matches && !captureMode;
    if (phoneHidden) {
      // Desktop -> phone (narrowed window): stop GPU work. CSS already hides
      // the fixed scene container on phones in both themes.
      cancelAnimationFrame(frame);
      frame = 0;
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    draw();
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType === "touch" || paused) return;
    pointerTarget.set(event.clientX / window.innerWidth * 2 - 1, event.clientY / window.innerHeight * 2 - 1);
  };
  const onScroll = () => { scrollTarget = window.scrollY / window.innerHeight; };
  const visibility = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    start();
  };
  const setPaused = (value: boolean) => {
    paused = value;
    cancelAnimationFrame(frame);
    frame = 0;
    start();
  };
  const onPreference = () => setPaused(motionPreference.matches);
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
    setPaused(true);
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
    setPaused(motionPreference.matches);
  };
  applyAppearance();
  resize();
  appearanceObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  systemAppearance.addEventListener("change", applyAppearance);
  canvas.dataset.state = "ready";
  start();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  document.addEventListener("astro:page-load", onScroll);
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
    document.removeEventListener("astro:page-load", onScroll);
    motionPreference.removeEventListener("change", onPreference);
    phoneQuery.removeEventListener("change", onPhoneChange);
    canvas.removeEventListener("webglcontextlost", contextLost);
    canvas.removeEventListener("webglcontextrestored", contextRestored);
    geometry.dispose();
    material.dispose();
    appearanceObserver.disconnect();
    systemAppearance.removeEventListener("change", applyAppearance);
    Object.values(environments).forEach((environment) => environment.dispose());
    renderer.dispose();
  });
}
