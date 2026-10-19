import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// Share images in the site's own look: white paper, the breadcrumb, the title,
// and the w/ mark from the favicon. Needs rsvg-convert and woff2_decompress:
// the site's fonts are unpacked to TTF, which rsvg-convert then finds through
// a private fontconfig file.
const outputDir = path.resolve("public/social");
const fontDir = path.resolve("src/assets/fonts");
const workDir = mkdtempSync(path.join(tmpdir(), "warre-social-cards-"));
mkdirSync(outputDir, { recursive: true });

const cards = [
  {
    slug: "home",
    trail: ["github", "linkedin", "cv"],
    title: ["Warre Snaet"],
    detail: "AI engineer from Belgium · Physical AI at Captic from November 2026",
  },
  {
    slug: "apolloon",
    trail: ["work", "apolloon"],
    title: ["Apolloon race", "operations"],
    detail: "Three Electron laptops · Raft consensus · SQLite replication",
  },
  {
    slug: "athas",
    trail: ["work", "athas"],
    title: ["Athas code editor"],
    detail: "Rust · Tauri · React · TypeScript · LSP",
  },
  {
    slug: "aws-fargate-vault",
    trail: ["work", "aws fargate vault"],
    title: ["AWS Fargate with", "Vault identity"],
    detail: "Terraform · private workloads · IAM · secrets delivery",
  },
  {
    slug: "azure-mlops",
    trail: ["work", "azure mlops"],
    title: ["Azure ML lifecycle"],
    detail: "Training · registry · inference · deployment verification",
  },
  {
    slug: "dataset-query",
    trail: ["work", "dataset query"],
    title: ["Dataset query", "system"],
    detail: "Python · TCP sockets · PySide6 · PostgreSQL",
  },
  {
    slug: "financial-agent",
    trail: ["work", "financial agent"],
    title: ["Financial AI agent"],
    detail: "FastAPI · MCP · RAG · PostgreSQL · Ollama",
  },
  {
    slug: "medical-imaging",
    trail: ["work", "medical imaging"],
    title: ["Medical imaging", "pipeline"],
    detail: "Python · DICOM · OCR · PyTorch GPU ECC · review tooling",
  },
  {
    slug: "xpo-chatbot",
    trail: ["work", "xpo chatbot"],
    title: ["Event chatbot for", "Kortrijk Xpo"],
    detail: ".NET · Azure OpenAI · Cosmos DB · Python ingestion",
  },
  {
    slug: "cv",
    trail: ["cv"],
    title: ["Warre Snaet"],
    detail: "Physical AI Engineer · Vilvoorde, Belgium",
  },
  {
    slug: "blog-rust",
    trail: ["writing", "rust and burn"],
    title: ["Semi-supervised AI", "in Rust"],
    detail: "Burn · pseudo-labeling · offline mobile inference",
  },
];

const ink = "#09090b";
const text = "#3f3f46";
const muted = "#71717a";
const sans = "Schibsted Grotesk";
const mono = "JetBrains Mono";

const escapeXml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

// Break the detail at its " · " separators so no line runs past the card.
function wrap(detail, maxLength = 60) {
  const lines = [];
  for (const segment of detail.split(" · ")) {
    const candidate = lines.length ? `${lines.at(-1)} · ${segment}` : segment;
    if (lines.length && candidate.length <= maxLength) lines[lines.length - 1] = candidate;
    else lines.push(segment);
  }
  return lines;
}

function renderCard(card) {
  const crumbs = ["warre snaet", ...card.trail].map((crumb, index, all) => {
    const current = index === all.length - 1 && index > 0;
    // SVG collapses spaces, so the gaps around each slash are offsets.
    const separator = index > 0 ? `<tspan dx="16" fill="${muted}">/</tspan>` : "";
    const gap = index > 0 ? ' dx="16"' : "";
    return `${separator}<tspan${gap} fill="${current ? muted : text}"${current ? "" : ' text-decoration="underline"'}>${escapeXml(crumb)}</tspan>`;
  }).join("");
  const title = card.title.map((line, index) =>
    `<text x="96" y="${290 + index * 80}" fill="${ink}" font-family="${sans}" font-size="72" font-weight="500" letter-spacing="-1.5">${escapeXml(line)}</text>`,
  ).join("");
  const detailY = 290 + card.title.length * 80 - 10;
  const detail = wrap(card.detail).map((line, index) =>
    `<text x="96" y="${detailY + index * 40}" fill="${muted}" font-family="${sans}" font-size="30">${escapeXml(line)}</text>`,
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <text x="96" y="130" font-family="${sans}" font-size="28">${crumbs}</text>
  ${title}
  ${detail}
  <text x="96" y="538" fill="${ink}" font-family="${sans}" font-size="44" font-weight="600">w/</text>
  <text x="1104" y="534" fill="${muted}" font-family="${mono}" font-size="22" text-anchor="end">snaetwarre.github.io/My-Portofolio</text>
</svg>`;
}

const ttfDir = path.join(workDir, "fonts");
mkdirSync(ttfDir);
for (const file of readdirSync(fontDir).filter((name) => name.endsWith(".woff2"))) {
  copyFileSync(path.join(fontDir, file), path.join(ttfDir, file));
  execFileSync("woff2_decompress", [path.join(ttfDir, file)]);
}

const fontConfig = path.join(workDir, "fonts.conf");
writeFileSync(fontConfig, `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>
  <dir>${ttfDir}</dir>
  <cachedir>${path.join(workDir, "cache")}</cachedir>
</fontconfig>
`);

try {
  for (const card of cards) {
    const svgPath = path.join(workDir, `${card.slug}.svg`);
    writeFileSync(svgPath, renderCard(card));
    execFileSync(
      "rsvg-convert",
      ["--width", "1200", "--height", "630", svgPath, "--output", path.join(outputDir, `${card.slug}.png`)],
      { env: { ...process.env, FONTCONFIG_FILE: fontConfig } },
    );
  }
  console.log(`Generated ${cards.length} social cards in ${outputDir}`);
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
