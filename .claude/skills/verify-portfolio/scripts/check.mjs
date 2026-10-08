#!/usr/bin/env node
// Screenshot pages of the portfolio in headless Chrome and flag layout faults.
//
// usage: check.mjs <baseUrl> <outDir> [--pages p1,p2] [--widths 1920,1280,390]
//                  [--schemes light,dark] [--height 900] [--full] [--eval "js"] [--media print]
//
// --eval runs a JS expression after load (click a button, follow a link). Its
// return value is printed as "eval-result" and does not count as a failure.
// The checks and the screenshot then run on whatever page is showing.
//
// <baseUrl> ends in /My-Portofolio/. Pages are paths under it ("", "work/athas.html").
// Without --pages it checks every .html file in dist/.
// Writes <outDir>/<page>__<width>-<scheme>.png and <outDir>/report.json.
// Exits 1 when any check fails, so it works as a gate.
import { spawn } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const [baseUrl, outDir] = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
if (!baseUrl || !outDir) {
  console.error("usage: check.mjs <baseUrl> <outDir> [--pages ...] [--widths ...] [--schemes ...] [--height N] [--full] [--eval js]");
  process.exit(2);
}
const root = join(dirname(fileURLToPath(import.meta.url)), "../../../..");
const dist = join(root, "dist");
const listHtml = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listHtml(path);
    return name.endsWith(".html") ? [relative(dist, path)] : [];
  });
const pages = flag("pages")?.split(",") ?? listHtml(dist).map((p) => (p === "index.html" ? "" : p)).sort();
const widths = (flag("widths") ?? "1920,1280,390").split(",").map(Number);
const schemes = (flag("schemes") ?? "light").split(",");
const height = Number(flag("height", "900"));
const full = args.includes("--full");
const extraEval = flag("eval");
const media = flag("media", ""); // "print" checks the print layout (the CV prints white)
mkdirSync(outDir, { recursive: true });

// One Chrome for the whole run, with its own profile and debug port.
const port = 9300 + Math.floor(Math.random() * 500);
const profile = `/tmp/verify-portfolio/chrome-${port}`;
const chrome = spawn(
  "google-chrome-stable",
  ["--headless=new", `--remote-debugging-port=${port}`, "--no-first-run", "--hide-scrollbars", `--user-data-dir=${profile}`, "about:blank"],
  { stdio: ["ignore", "ignore", "pipe"] },
);
chrome.stderr.on("data", () => {});
const quit = (code) => {
  chrome.once("exit", () => {
    rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
    process.exit(code);
  });
  chrome.kill("SIGKILL");
};
// A crash must not leave Chrome running.
const crash = (error) => {
  console.error(error);
  quit(2);
};
process.on("uncaughtException", crash);
process.on("unhandledRejection", crash);
let version;
for (let i = 0; i < 50 && !version; i++) {
  try {
    version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  } catch {
    await new Promise((r) => setTimeout(r, 200));
  }
}
if (!version) {
  console.error("chrome did not start");
  quit(2);
  await new Promise(() => {}); // wait for quit to exit the process
}
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let nextId = 0;
const pending = new Map();
const listeners = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { resolve, reject, method } = pending.get(m.id);
    m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result);
    pending.delete(m.id);
  } else if (m.method) listeners.forEach((fn) => fn(m));
};
const send = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject, method });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });

// Runs inside the page. Returns a list of problems found on the whole page.
const inspect = () => {
  const problems = [];
  const vw = document.documentElement.clientWidth;
  const label = (el) => {
    const text = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
    return `${el.tagName.toLowerCase()} "${text}"`;
  };
  // Hidden on purpose: display/visibility/opacity, or clipped to 1px like
  // screen-reader-only text and KaTeX's MathML copy. A 0px-wide box whose
  // text spills out is NOT hidden; that is exactly the bug to catch.
  const visible = (el) => {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return false;
      if (cs.clip !== "auto" || cs.clipPath !== "none") return false;
      const r = n.getBoundingClientRect();
      if (cs.overflow !== "visible" && (r.width <= 1 || r.height <= 1)) return false;
    }
    const r = el.getBoundingClientRect();
    return r.bottom + scrollY > 0 && r.right > 0 && r.top + scrollY < document.documentElement.scrollHeight;
  };

  // 1. Horizontal overflow.
  if (document.documentElement.scrollWidth > vw + 1) {
    const wide = [...document.body.querySelectorAll("*")]
      .filter((el) => visible(el) && el.getBoundingClientRect().right > vw + 1)
      .slice(-3)
      .map(label);
    problems.push({ kind: "overflow-x", detail: `page is ${document.documentElement.scrollWidth}px wide in a ${vw}px window`, elements: wide });
  }

  // Text boxes, one per rendered line, grouped by the element that owns the text.
  const owners = [...document.body.querySelectorAll("*")].filter(
    // KaTeX stacks glyphs on purpose (sums, hats), so formulas are skipped.
    (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && !el.closest(".katex") && visible(el),
  );
  const boxes = owners.map((el) => {
    const rects = [];
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) if (r.width > 1 && r.height > 1) rects.push(r);
    }
    return { el, rects };
  });

  // 2. Text drawn on top of other text.
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const hit = a.rects.some((ra) =>
        b.rects.some((rb) => {
          const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
          const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
          // Ignore the few pixels where two stacked lines' boxes touch;
          // real collisions cover a good part of a line's height.
          return w > 1 && h > 0.3 * Math.min(ra.height, rb.height);
        }),
      );
      if (hit) problems.push({ kind: "text-overlap", detail: `${label(a.el)} overlaps ${label(b.el)}` });
    }
  }

  // 3a. Text that lives in a box with no width and spills out of it.
  for (const { el, rects } of boxes) {
    if (rects.length && el.getBoundingClientRect().width < 2 && getComputedStyle(el).display !== "inline") {
      problems.push({ kind: "collapsed-box", detail: `${label(el)} sits in a ${Math.round(el.getBoundingClientRect().width)}px wide box` });
    }
  }

  // 3b. Text squeezed into a column so thin that short phrases wrap word by word.
  for (const { el, rects } of boxes) {
    const words = (el.textContent ?? "").trim().split(/\s+/).length;
    const lines = new Set(rects.map((r) => Math.round(r.top))).size;
    const width = el.getBoundingClientRect().width;
    if (words >= 2 && lines >= 3 && lines >= words * 0.6 && width < 200) {
      problems.push({ kind: "squeezed-text", detail: `${label(el)} wraps ${words} words over ${lines} lines in ${Math.round(width)}px` });
    }
  }

  // 4. Text cut off by its own box.
  for (const { el } of boxes) {
    const cs = getComputedStyle(el);
    if (cs.overflow !== "visible" && el.scrollWidth > el.clientWidth + 1 && cs.textOverflow !== "ellipsis") {
      problems.push({ kind: "clipped-text", detail: `${label(el)} needs ${el.scrollWidth}px but has ${el.clientWidth}px` });
    }
  }

  // 5. Images that did not load.
  for (const img of document.images) {
    if (img.complete && img.naturalWidth === 0) problems.push({ kind: "broken-image", detail: img.getAttribute("src") });
  }
  return problems;
};

const settle = "new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r)).then(() => document.fonts.ready).then(() => location.href)";
// The home page's "Copy email" button needs clipboard access in headless Chrome.
await send("Browser.grantPermissions", { permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"], origin: new URL(baseUrl).origin });
const report = [];
for (const page of pages) {
  for (const width of widths) {
    for (const scheme of schemes) {
      const url = new URL(page, baseUrl).href;
      const { targetId } = await send("Target.createTarget", { url: "about:blank" });
      const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
      const s = (m, p) => send(m, p, sessionId);
      const problems = [];
      const onEvent = (m) => {
        if (m.sessionId !== sessionId) return;
        if (m.method === "Network.responseReceived" && m.params.response.status >= 400)
          problems.push({ kind: "http-error", detail: `${m.params.response.status} ${m.params.response.url}` });
        if (m.method === "Network.loadingFailed" && !m.params.canceled)
          problems.push({ kind: "request-failed", detail: m.params.errorText });
        if (m.method === "Runtime.exceptionThrown")
          problems.push({ kind: "js-error", detail: m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text });
        if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error")
          problems.push({ kind: "console-error", detail: m.params.args.map((a) => a.value ?? a.description).join(" ") });
      };
      listeners.push(onEvent);
      await s("Network.enable");
      await s("Runtime.enable");
      await s("Page.enable");
      await s("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 600 });
      await s("Emulation.setEmulatedMedia", { media, features: [{ name: "prefers-color-scheme", value: scheme }] });
      await s("Page.navigate", { url });
      await s("Runtime.evaluate", { expression: settle, awaitPromise: true });
      await new Promise((r) => setTimeout(r, 400));
      if (extraEval) {
        // The expression may click a link; wait for whatever page is there now to settle.
        const { result: evalResult } = await s("Runtime.evaluate", { expression: extraEval, awaitPromise: true, returnByValue: true });
        if (evalResult?.value !== undefined) problems.push({ kind: "eval-result", detail: JSON.stringify(evalResult.value), info: true });
        await new Promise((r) => setTimeout(r, 1200));
        await s("Runtime.evaluate", { expression: settle, awaitPromise: true });
      }
      const { result } = await s("Runtime.evaluate", { expression: `(${inspect})()`, returnByValue: true });
      problems.push(...(result.value ?? [{ kind: "inspect-failed", detail: JSON.stringify(result) }]));
      const { result: finalUrl } = await s("Runtime.evaluate", { expression: "location.href", returnByValue: true });
      const name = `${(page || "index").replace(/\.html$/, "").replaceAll("/", "_")}__${width}-${scheme}.png`;
      const { data } = await s("Page.captureScreenshot", { format: "png", captureBeyondViewport: full });
      writeFileSync(join(outDir, name), Buffer.from(data, "base64"));
      listeners.splice(listeners.indexOf(onEvent), 1);
      await send("Target.closeTarget", { targetId });
      report.push({ page: page || "index", url: finalUrl.value, width, scheme, screenshot: name, problems });
      const faults = problems.filter((p) => !p.info).length;
      const status = faults ? `FAIL ${faults}` : "ok";
      console.log(`${status.padEnd(7)} ${(page || "index").padEnd(28)} ${String(width).padStart(4)} ${scheme}`);
      if (finalUrl.value !== url) console.log(`          now at ${finalUrl.value}`);
      for (const p of problems) console.log(`          ${p.kind}: ${p.detail}${p.elements ? ` [${p.elements.join("; ")}]` : ""}`);
    }
  }
}
writeFileSync(join(outDir, "report.json"), JSON.stringify(report, null, 2));
const failed = report.filter((r) => r.problems.some((p) => !p.info)).length;
console.log(`\n${report.length - failed}/${report.length} clean. Screenshots and report.json in ${outDir}`);
quit(failed ? 1 : 0);
