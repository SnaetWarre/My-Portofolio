import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const outputDir = path.resolve("public/social");
const workDir = mkdtempSync(path.join(tmpdir(), "warre-social-cards-"));
mkdirSync(outputDir, { recursive: true });

const cards = [
  {
    slug: "apolloon",
    label: "Paid client project",
    title: ["Apolloon race", "operations"],
    detail: "Local-first Electron hosts · LAN discovery · SQLite replication",
    diagram: "cluster",
  },
  {
    slug: "athas",
    label: "Open-source work",
    title: ["Athas code editor"],
    detail: "Rust · Tauri · React · TypeScript · LSP",
    diagram: "editor",
  },
  {
    slug: "aws-fargate-vault",
    label: "Cloud infrastructure",
    title: ["AWS Fargate with", "Vault identity"],
    detail: "Terraform · private workloads · IAM · secrets delivery",
    diagram: "layers",
  },
  {
    slug: "azure-mlops",
    label: "Machine-learning operations",
    title: ["Azure ML lifecycle"],
    detail: "Training · registry · inference · deployment verification",
    diagram: "pipeline",
  },
  {
    slug: "dataset-query",
    label: "Distributed application",
    title: ["Dataset query", "system"],
    detail: "Python · TCP sockets · PySide6 · PostgreSQL",
    diagram: "client-server",
  },
  {
    slug: "financial-agent",
    label: "Agent infrastructure",
    title: ["Financial AI agent"],
    detail: "FastAPI · MCP · RAG · PostgreSQL · Ollama",
    diagram: "services",
  },
  {
    slug: "medical-imaging",
    label: "International internship",
    title: ["Medical imaging", "pipeline"],
    detail: "Python · DICOM · OCR · OpenCV · review tooling",
    diagram: "imaging",
  },
  {
    slug: "xpo-chatbot",
    label: "External client project",
    title: ["Event chatbot for", "XPO Group"],
    detail: ".NET · Azure OpenAI · Cosmos DB · Python ingestion",
    diagram: "retrieval",
  },
  {
    slug: "cv",
    label: "Curriculum vitae",
    title: ["Warre Snaet"],
    detail: "Backend & Applied AI Engineer",
    diagram: "document",
  },
  {
    slug: "blog-rust",
    label: "Engineering article",
    title: ["Semi-supervised AI", "in Rust"],
    detail: "Burn · pseudo-labeling · offline mobile inference",
    diagram: "learning",
  },
];

const escapeXml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

function diagram(type) {
  const box = (x, y, width, height, fill = "#ffffff") =>
    `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="#000000" stroke-width="2"/>`;
  const line = (x1, y1, x2, y2) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000000" stroke-width="2"/>`;
  const node = (x, y, radius = 8) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="#000000"/>`;

  switch (type) {
    case "cluster":
      return `${line(836, 315, 980, 225)}${line(836, 315, 1006, 385)}${line(980, 225, 1006, 385)}${box(790, 275, 92, 80)}${box(934, 185, 92, 80, "#f2f2f2")}${box(960, 345, 92, 80)}`;
    case "editor":
      return `${box(790, 185, 292, 250)}${line(866, 185, 866, 435)}${line(806, 220, 850, 220)}${line(806, 250, 850, 250)}${line(892, 230, 1048, 230)}${line(892, 270, 1014, 270)}${line(892, 310, 1050, 310)}${line(892, 350, 978, 350)}`;
    case "layers":
      return `${box(806, 190, 260, 70)}${box(830, 285, 212, 70, "#f2f2f2")}${box(854, 380, 164, 70)}${line(936, 260, 936, 285)}${line(936, 355, 936, 380)}`;
    case "pipeline":
      return `${line(806, 315, 1060, 315)}${node(806, 315, 15)}${node(890, 315, 15)}${node(974, 315, 15)}${node(1060, 315, 15)}${box(780, 385, 78, 44)}${box(851, 385, 78, 44)}${box(936, 385, 78, 44)}${box(1021, 385, 78, 44)}`;
    case "client-server":
      return `${box(786, 220, 100, 80)}${box(786, 350, 100, 80)}${box(976, 270, 116, 110, "#f2f2f2")}${line(886, 260, 976, 310)}${line(886, 390, 976, 340)}`;
    case "services":
      return `${box(788, 190, 126, 70)}${box(958, 190, 126, 70)}${box(788, 375, 126, 70)}${box(958, 375, 126, 70)}${node(936, 317, 28)}${line(914, 232, 930, 290)}${line(958, 232, 942, 290)}${line(914, 410, 930, 344)}${line(958, 410, 942, 344)}`;
    case "imaging":
      return `${box(800, 180, 230, 270)}${box(826, 206, 230, 270, "#f2f2f2")}<path d="M850 330 C890 255 955 410 1028 290" fill="none" stroke="#000000" stroke-width="5"/><rect x="866" y="238" width="78" height="52" fill="#ffffff" stroke="#000000" stroke-width="2"/>`;
    case "retrieval":
      return `${box(786, 195, 216, 105)}<path d="M820 300 L806 334 L854 300" fill="#ffffff" stroke="#000000" stroke-width="2"/>${node(1048, 245, 12)}${node(1090, 315, 12)}${node(1026, 390, 12)}${line(1002, 250, 1036, 247)}${line(1048, 257, 1080, 305)}${line(1082, 325, 1036, 382)}`;
    case "document":
      return `${box(824, 160, 226, 310)}${line(864, 230, 1010, 230)}${line(864, 275, 984, 275)}${line(864, 320, 1010, 320)}${line(864, 365, 960, 365)}${line(864, 410, 1000, 410)}`;
    case "learning":
      return `${node(810, 245, 12)}${node(810, 385, 12)}${node(925, 200, 12)}${node(925, 315, 12)}${node(925, 430, 12)}${node(1052, 260, 12)}${node(1052, 370, 12)}${line(822, 245, 913, 200)}${line(822, 245, 913, 315)}${line(822, 385, 913, 315)}${line(822, 385, 913, 430)}${line(937, 200, 1040, 260)}${line(937, 315, 1040, 260)}${line(937, 315, 1040, 370)}${line(937, 430, 1040, 370)}`;
    default:
      return "";
  }
}

function renderCard(card) {
  const title = card.title.map((line, index) =>
    `<text x="80" y="${265 + index * 74}" fill="#000000" font-family="Inter, Arial, sans-serif" font-size="64" font-weight="600" letter-spacing="-2">${escapeXml(line)}</text>`,
  ).join("");
  const detailY = card.title.length === 1 ? 370 : 425;
  const detailLines = [];
  for (const segment of card.detail.split(" · ")) {
    if (detailLines.length === 0) {
      detailLines.push(segment);
      continue;
    }
    const candidate = `${detailLines.at(-1)} · ${segment}`;
    if (candidate.length <= 43) detailLines[detailLines.length - 1] = candidate;
    else detailLines.push(segment);
  }
  const detail = detailLines.map((line, index) =>
    `<text x="80" y="${detailY + index * 34}" fill="#4a4a4a" font-family="Inter, Arial, sans-serif" font-size="24">${escapeXml(line)}</text>`,
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <text x="80" y="105" fill="#4a4a4a" font-family="Inter, Arial, sans-serif" font-size="26">${escapeXml(card.label)}</text>
  ${title}
  ${detail}
  <line x1="720" y1="80" x2="720" y2="550" stroke="#d4d4d4" stroke-width="2"/>
  ${diagram(card.diagram)}
  <line x1="80" y1="550" x2="1120" y2="550" stroke="#000000" stroke-width="2"/>
</svg>`;
}

try {
  for (const card of cards) {
    const svgPath = path.join(workDir, `${card.slug}.svg`);
    writeFileSync(svgPath, renderCard(card));
    execFileSync("rsvg-convert", ["--width", "1200", "--height", "630", svgPath, "--output", path.join(outputDir, `${card.slug}.png`)]);
  }
  console.log(`Generated ${cards.length} social cards in ${outputDir}`);
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
