/**
 * Builds the site's architecture drawings as SVG strings at build time.
 *
 * A drawing is a list of nodes and edges on a small grid. Edges run
 * orthogonally between the nearest sides of two nodes, so their lengths can
 * be computed here and used for the draw-on animation without any client code.
 */

export type NodeKind = "box" | "cylinder" | "phone" | "group" | "note";

export interface SchematicNode {
  id: string;
  /** Lines are separated by "|". */
  label: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  kind?: NodeKind;
}

export interface SchematicEdge {
  from: string;
  to: string;
  dashed?: boolean;
  label?: string;
  /** Arrow heads: "end" (default), "both", or "none". */
  arrows?: "end" | "both" | "none";
}

export interface Schematic {
  /** Used for the arrowhead marker id, so it must be unique per page. */
  id: string;
  /** Spoken description for assistive technology. */
  alt: string;
  width: number;
  height: number;
  /** Distance between the lines of a multi-line label. */
  lineHeight?: number;
  nodes: SchematicNode[];
  edges: SchematicEdge[];
}

export interface RenderOptions {
  /** Extra classes on the root, e.g. "cover" or "lead". */
  className?: string;
  /** Draw the lines on load and send one packet along the first edge. */
  animated?: boolean;
}

type Placed = Required<Omit<SchematicNode, "kind">> & { kind: NodeKind };

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Side = "l" | "r" | "t" | "b";

function port(n: Placed, side: Side): [number, number] {
  if (side === "r") return [n.x + n.w, n.y + n.h / 2];
  if (side === "l") return [n.x, n.y + n.h / 2];
  if (side === "t") return [n.x + n.w / 2, n.y];
  return [n.x + n.w / 2, n.y + n.h];
}

function sides(a: Placed, b: Placed): [Side, Side] {
  const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
  const bx = b.x + b.w / 2, by = b.y + b.h / 2;
  if (Math.abs(bx - ax) > Math.abs(by - ay)) return bx > ax ? ["r", "l"] : ["l", "r"];
  return by > ay ? ["b", "t"] : ["t", "b"];
}

export function renderSchematic(spec: Schematic, options: RenderOptions = {}): string {
  const nodes = new Map<string, Placed>();
  for (const n of spec.nodes) {
    nodes.set(n.id, { id: n.id, label: n.label, x: n.x, y: n.y, w: n.w ?? 92, h: n.h ?? 34, kind: n.kind ?? "box" });
  }
  const lineHeight = spec.lineHeight ?? 13;
  const marker = `arrow-${spec.id}`;
  const parts: string[] = [];
  const classes = ["schematic", options.className, options.animated && "animated"].filter(Boolean).join(" ");

  parts.push(
    `<svg class="${classes}" viewBox="0 0 ${spec.width} ${spec.height}" role="img" aria-label="${escape(spec.alt)}" xmlns="http://www.w3.org/2000/svg">`,
    `<defs><marker id="${marker}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrow" d="M0 0.5 L7.5 4 L0 7.5"/></marker></defs>`,
  );

  // Edges first, so boxes cover the line ends.
  const edges: string[] = [];
  const labels: string[] = [];
  let firstPath = "";
  spec.edges.forEach((e, index) => {
    const a = nodes.get(e.from), b = nodes.get(e.to);
    if (!a || !b) throw new Error(`Schematic ${spec.id}: edge ${e.from} -> ${e.to} names a missing node`);
    const [sa, sb] = sides(a, b);
    const [x1, y1] = port(a, sa), [x2, y2] = port(b, sb);
    let d: string;
    let length: number;
    if (sa === "r" || sa === "l") {
      const mx = (x1 + x2) / 2;
      d = `M${x1} ${y1} H${mx} V${y2} H${x2}`;
      length = Math.abs(mx - x1) + Math.abs(y2 - y1) + Math.abs(x2 - mx);
    } else {
      const my = (y1 + y2) / 2;
      d = `M${x1} ${y1} V${my} H${x2} V${y2}`;
      length = Math.abs(my - y1) + Math.abs(x2 - x1) + Math.abs(y2 - my);
    }
    if (!firstPath) firstPath = d;
    const arrows = e.arrows ?? "end";
    const markers =
      (arrows === "end" || arrows === "both" ? ` marker-end="url(#${marker})"` : "") +
      (arrows === "both" ? ` marker-start="url(#${marker})"` : "");
    let style = "";
    if (options.animated) {
      // Dashed lines keep their pattern; solid lines draw in from zero.
      const dash = e.dashed ? "3 3" : String(length);
      style = ` style="stroke-dasharray:${dash};stroke-dashoffset:${length};animation-delay:${300 + index * 180}ms"`;
    }
    edges.push(`<path class="edge${e.dashed ? " dashed" : ""}" d="${d}"${markers}${style}/>`);
    if (e.label) {
      const delay = options.animated ? ` style="animation-delay:${600 + index * 180}ms"` : "";
      labels.push(`<text class="note label" x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 + 4}" text-anchor="middle"${delay}>${escape(e.label)}</text>`);
    }
  });
  parts.push(`<g>${edges.join("")}${labels.join("")}</g>`);

  let nodeIndex = 0;
  for (const n of nodes.values()) {
    const delay = options.animated ? ` style="animation-delay:${200 + nodeIndex * 120}ms"` : "";
    nodeIndex += 1;
    const inner: string[] = [];
    if (n.kind === "group") {
      inner.push(`<rect class="box group" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}"/>`);
      inner.push(`<text class="note" x="${n.x + 6}" y="${n.y + 14}">${escape(n.label)}</text>`);
      parts.push(`<g class="node"${delay}>${inner.join("")}</g>`);
      continue;
    }
    if (n.kind === "note") {
      inner.push(`<text class="note" x="${n.x + n.w / 2}" y="${n.y + n.h / 2 + 4}" text-anchor="middle">${escape(n.label)}</text>`);
      parts.push(`<g class="node"${delay}>${inner.join("")}</g>`);
      continue;
    }
    if (n.kind === "cylinder") {
      const r = n.w / 2;
      inner.push(`<path class="box" d="M${n.x} ${n.y + 6} a${r} 6 0 0 0 ${n.w} 0 v${n.h - 12} a${r} 6 0 0 1 -${n.w} 0 z"/>`);
      inner.push(`<ellipse class="box" cx="${n.x + r}" cy="${n.y + 6}" rx="${r}" ry="6"/>`);
    } else if (n.kind === "phone") {
      inner.push(`<rect class="box" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="3"/>`);
      inner.push(`<line class="edge" x1="${n.x + n.w / 2 - 5}" y1="${n.y + n.h - 5}" x2="${n.x + n.w / 2 + 5}" y2="${n.y + n.h - 5}"/>`);
    } else {
      inner.push(`<rect class="box" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}"/>`);
    }
    const lines = n.label.split("|");
    lines.forEach((line, i) => {
      const y = n.y + n.h / 2 + 4 + (i - (lines.length - 1) / 2) * lineHeight;
      inner.push(`<text x="${n.x + n.w / 2}" y="${y}" text-anchor="middle">${escape(line)}</text>`);
    });
    parts.push(`<g class="node"${delay}>${inner.join("")}</g>`);
  }

  if (options.animated && firstPath) {
    // One packet travels the first edge after the drawing has appeared.
    parts.push(
      `<path id="route-${spec.id}" d="${firstPath}" fill="none" stroke="none"/>`,
      `<circle class="packet" r="3" opacity="0"><set attributeName="opacity" to="1" begin="2.2s" fill="freeze"/><animateMotion dur="6s" begin="2.2s" repeatCount="indefinite"><mpath href="#route-${spec.id}"/></animateMotion></circle>`,
    );
  }

  parts.push("</svg>");
  return parts.join("");
}
