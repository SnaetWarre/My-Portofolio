import type { Schematic } from "./schematic";

/**
 * Every drawing on the site. Coordinates are in a 320 by 190 box unless
 * the drawing says otherwise. Keep labels short: they are set at 11.5px.
 */
export const drawings = {
  /** The home page cover: Apolloon hosts syncing over the event network. */
  cover: {
    id: "cover",
    alt: "Four event hosts on a local network with no internet. They announce themselves over signed UDP, pair once, and exchange missing operations over authenticated HTTP.",
    width: 1120,
    height: 330,
    lineHeight: 17,
    nodes: [
      { id: "a", label: "Finish line host|Electron, SQLite", x: 60, y: 60, w: 160, h: 52 },
      { id: "b", label: "Registration host|Electron, SQLite", x: 460, y: 40, w: 160, h: 52 },
      { id: "c", label: "Scoreboard host|Electron, SQLite", x: 250, y: 220, w: 160, h: 52 },
      { id: "d", label: "Spare host|joins later", x: 520, y: 200, w: 160, h: 52 },
      { id: "lan", label: "Event LAN, no internet", x: 10, y: 6, w: 690, h: 310, kind: "group" },
    ],
    edges: [
      { from: "a", to: "b", label: "signed UDP announcements", arrows: "both" },
      { from: "a", to: "c", label: "missing operations, authenticated HTTP", arrows: "both" },
      { from: "b", to: "c", arrows: "both" },
      { from: "b", to: "d", dashed: true, label: "pair once", arrows: "both" },
      { from: "c", to: "d", dashed: true, arrows: "both" },
    ],
  },

  /** Wide pipeline shown under the medical imaging entry on the home page. */
  dicomWide: {
    id: "dicom-wide",
    alt: "DICOM studies pass a metadata filter, then OCR reads the measurements, which go to review tools.",
    width: 820,
    height: 120,
    nodes: [
      { id: "s", label: "DICOM studies", x: 8, y: 42, w: 104, h: 36, kind: "cylinder" },
      { id: "f", label: "Metadata filter", x: 170, y: 42, w: 110, h: 36 },
      { id: "n", label: "21 hours became 23 minutes", x: 170, y: 96, w: 110, h: 1, kind: "note" },
      { id: "o", label: "OCR", x: 340, y: 42, w: 80, h: 36 },
      { id: "m", label: "Measurements", x: 480, y: 42, w: 110, h: 36 },
      { id: "r", label: "Review tools", x: 660, y: 42, w: 100, h: 36 },
    ],
    edges: [
      { from: "s", to: "f" },
      { from: "f", to: "o" },
      { from: "o", to: "m" },
      { from: "m", to: "r" },
    ],
  },

  medicalImaging: {
    id: "dicom",
    alt: "DICOM studies go through a metadata filter, OCR, and a video matcher. Measurements and review tools come out.",
    width: 320,
    height: 190,
    nodes: [
      { id: "s", label: "DICOM studies", x: 8, y: 70, w: 92, h: 34, kind: "cylinder" },
      { id: "f", label: "Metadata filter", x: 128, y: 20 },
      { id: "o", label: "OCR", x: 128, y: 70 },
      { id: "v", label: "Video matcher", x: 128, y: 120 },
      { id: "m", label: "Measurements", x: 236, y: 45, w: 78 },
      { id: "r", label: "Review tools", x: 236, y: 120, w: 78 },
    ],
    edges: [
      { from: "s", to: "f" },
      { from: "s", to: "o" },
      { from: "s", to: "v" },
      { from: "f", to: "m" },
      { from: "o", to: "m" },
      { from: "v", to: "r" },
      { from: "m", to: "r", dashed: true },
    ],
  },

  apolloon: {
    id: "apolloon",
    alt: "Three event hosts, each with its own SQLite database, find each other over the LAN and sync over HTTP.",
    width: 320,
    height: 190,
    nodes: [
      { id: "a", label: "Host A|SQLite", x: 8, y: 20, w: 84, h: 44 },
      { id: "b", label: "Host B|SQLite", x: 228, y: 20, w: 84, h: 44 },
      { id: "c", label: "Host C|SQLite", x: 118, y: 126, w: 84, h: 44 },
    ],
    edges: [
      { from: "a", to: "b", label: "signed UDP announce", arrows: "both" },
      { from: "a", to: "c", label: "missing ops over HTTP", arrows: "both" },
      { from: "b", to: "c", arrows: "both" },
    ],
  },

  awsFargateVault: {
    id: "aws",
    alt: "A load balancer in front of Fargate tasks in two availability zones. The tasks log in to Vault with their IAM role and report to CloudWatch.",
    width: 320,
    height: 190,
    nodes: [
      { id: "z1", label: "Zone a", x: 100, y: 8, w: 100, h: 80, kind: "group" },
      { id: "z2", label: "Zone b", x: 100, y: 100, w: 100, h: 80, kind: "group" },
      { id: "lb", label: "Load|balancer", x: 8, y: 78, w: 68, h: 44 },
      { id: "t1", label: "Task", x: 118, y: 36, w: 64, h: 30 },
      { id: "t2", label: "Task", x: 118, y: 128, w: 64, h: 30 },
      { id: "v", label: "Vault", x: 240, y: 78, w: 72 },
      { id: "cw", label: "CloudWatch", x: 240, y: 140, w: 72, h: 30 },
    ],
    edges: [
      { from: "lb", to: "t1" },
      { from: "lb", to: "t2" },
      { from: "t1", to: "v", label: "IAM login" },
      { from: "t2", to: "v" },
      { from: "t2", to: "cw", dashed: true },
    ],
  },

  financialAgent: {
    id: "agent",
    alt: "A React frontend talks to a streaming FastAPI backend, which uses MCP tools, ChromaDB, PostgreSQL, and local models through Ollama.",
    width: 320,
    height: 190,
    nodes: [
      { id: "ui", label: "React", x: 8, y: 78, w: 64 },
      { id: "api", label: "FastAPI|streaming", x: 104, y: 70, w: 84, h: 50 },
      { id: "mcp", label: "MCP tools", x: 236, y: 10, w: 76, h: 30 },
      { id: "rag", label: "ChromaDB", x: 236, y: 52, w: 76, h: 30, kind: "cylinder" },
      { id: "pg", label: "PostgreSQL", x: 236, y: 96, w: 76, h: 30, kind: "cylinder" },
      { id: "ol", label: "Ollama", x: 236, y: 145, w: 76, h: 30 },
    ],
    edges: [
      { from: "ui", to: "api" },
      { from: "api", to: "mcp" },
      { from: "api", to: "rag" },
      { from: "api", to: "pg" },
      { from: "api", to: "ol" },
    ],
  },

  azureMlops: {
    id: "azure",
    alt: "Three parallel data preparation steps feed training. MLflow tracks the runs. The registered model is served by FastAPI in Docker on Kubernetes.",
    width: 320,
    height: 190,
    nodes: [
      { id: "d1", label: "Prep", x: 8, y: 20, w: 56, h: 28 },
      { id: "d2", label: "Prep", x: 8, y: 56, w: 56, h: 28 },
      { id: "d3", label: "Prep", x: 8, y: 92, w: 56, h: 28 },
      { id: "tr", label: "Train", x: 100, y: 56, w: 64, h: 28 },
      { id: "ml", label: "MLflow", x: 100, y: 130, w: 64, h: 28, kind: "cylinder" },
      { id: "reg", label: "Registry", x: 200, y: 56, w: 64, h: 28 },
      { id: "k", label: "Kubernetes", x: 190, y: 100, w: 122, h: 84, kind: "group" },
      { id: "api", label: "FastAPI|in Docker", x: 212, y: 126, w: 80, h: 44 },
    ],
    edges: [
      { from: "d1", to: "tr" },
      { from: "d2", to: "tr" },
      { from: "d3", to: "tr" },
      { from: "tr", to: "ml", dashed: true },
      { from: "tr", to: "reg" },
      { from: "reg", to: "api" },
    ],
  },

  rustSemiSupervised: {
    id: "rust",
    alt: "A small labeled set and a large unlabeled set train a model written with Rust and Burn. The model runs offline on a phone in a 26 MB app.",
    width: 320,
    height: 190,
    nodes: [
      { id: "l", label: "Labeled|few", x: 8, y: 28, w: 72, h: 44 },
      { id: "u", label: "Unlabeled|many", x: 8, y: 108, w: 72, h: 44 },
      { id: "pl", label: "pseudo labels", x: 84, y: 150, w: 60, h: 1, kind: "note" },
      { id: "m", label: "Model|Rust, Burn", x: 128, y: 68, w: 84, h: 50 },
      { id: "p", label: "Phone|26 MB, offline", x: 256, y: 50, w: 56, h: 90, kind: "phone" },
    ],
    edges: [
      { from: "l", to: "m" },
      { from: "u", to: "m", dashed: true },
      { from: "m", to: "p" },
    ],
  },

  xpoChatbot: {
    id: "xpo",
    alt: "Python scrapers fill Cosmos DB. A .NET API answers questions with Azure OpenAI, and a Next.js dashboard shows the analytics.",
    width: 320,
    height: 190,
    nodes: [
      { id: "sc", label: "Scrapers|Python", x: 8, y: 68, w: 72, h: 44 },
      { id: "db", label: "Cosmos DB", x: 112, y: 130, w: 80, h: 30, kind: "cylinder" },
      { id: "api", label: ".NET API", x: 112, y: 30, w: 80 },
      { id: "ai", label: "Azure OpenAI", x: 232, y: 30, w: 80 },
      { id: "dash", label: "Next.js|dashboard", x: 232, y: 118, w: 80, h: 44 },
    ],
    edges: [
      { from: "sc", to: "db" },
      { from: "db", to: "api" },
      { from: "api", to: "ai", arrows: "both" },
      { from: "api", to: "dash", dashed: true, label: "analytics" },
    ],
  },

  datasetQuery: {
    id: "dataset",
    alt: "Desktop clients talk to a server that handles logins, moderation, statistics, and broadcasts in front of a shared dataset.",
    width: 320,
    height: 190,
    nodes: [
      { id: "c1", label: "Client", x: 8, y: 20, w: 64, h: 28 },
      { id: "c2", label: "Client", x: 8, y: 80, w: 64, h: 28 },
      { id: "c3", label: "Client", x: 8, y: 140, w: 64, h: 28 },
      { id: "s", label: "Server|logins, moderation|stats, broadcasts", x: 120, y: 56, w: 120, h: 60 },
      { id: "d", label: "Dataset", x: 272, y: 68, w: 40, h: 36, kind: "cylinder" },
    ],
    edges: [
      { from: "c1", to: "s", arrows: "both" },
      { from: "c2", to: "s", arrows: "both" },
      { from: "c3", to: "s", arrows: "both" },
      { from: "s", to: "d" },
    ],
  },

  athas: {
    id: "athas",
    alt: "The editor's React and TypeScript side and its Tauri and Rust side, with the areas I changed written inside each.",
    width: 320,
    height: 190,
    nodes: [
      { id: "ui", label: "React, TypeScript|image diffs, Linux UI", x: 8, y: 40, w: 136, h: 50 },
      { id: "core", label: "Tauri, Rust|proxy ports, leak fixes|language servers", x: 176, y: 30, w: 136, h: 64 },
      { id: "cs", label: "C# support", x: 60, y: 140, w: 84, h: 28 },
    ],
    edges: [
      { from: "ui", to: "core", arrows: "both" },
      { from: "cs", to: "core" },
    ],
  },
} satisfies Record<string, Schematic>;

export type DrawingKey = keyof typeof drawings;
