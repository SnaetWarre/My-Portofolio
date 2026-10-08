import type { Schematic } from "./schematic";

/**
 * Every drawing on the site. Coordinates are in a 320 by 190 box unless
 * the drawing says otherwise. Keep labels short: they are set at 11.5px.
 */
export const drawings = {
  /** Wide pipeline shown under the medical imaging entry on the home page. */
  dicomWide: {
    id: "dicom-wide",
    alt: "DICOM studies go through measurement OCR, then a metadata filter and an image similarity search with GPU ECC that finds the source video. The top three videos go to review tools.",
    width: 820,
    height: 120,
    nodes: [
      { id: "s", label: "DICOM studies", x: 8, y: 42, w: 104, h: 36, kind: "cylinder" },
      { id: "o", label: "Measurement OCR", x: 142, y: 42, w: 120, h: 36 },
      { id: "f", label: "Metadata filter", x: 292, y: 42, w: 110, h: 36 },
      { id: "e", label: "Similarity search|GPU ECC", x: 432, y: 40, w: 120, h: 40 },
      { id: "n", label: "1182 s became 80 s", x: 432, y: 98, w: 120, h: 1, kind: "note" },
      { id: "t", label: "Top 3 videos", x: 582, y: 42, w: 100, h: 36 },
      { id: "r", label: "Review tools", x: 712, y: 42, w: 100, h: 36 },
    ],
    edges: [
      { from: "s", to: "o" },
      { from: "o", to: "f" },
      { from: "f", to: "e" },
      { from: "e", to: "t" },
      { from: "t", to: "r" },
    ],
  },

  medicalImaging: {
    id: "dicom",
    alt: "DICOM studies go through measurement OCR, ECG extraction, and a GPU similarity search that finds each measurement's source video. All three feed the review tools.",
    width: 320,
    height: 190,
    nodes: [
      { id: "s", label: "DICOM studies", x: 8, y: 70, w: 92, h: 34, kind: "cylinder" },
      { id: "o", label: "Measurement OCR", x: 124, y: 16, w: 96 },
      { id: "e", label: "ECG traces", x: 124, y: 70, w: 96 },
      { id: "v", label: "Video search|GPU ECC", x: 124, y: 122, w: 96, h: 44 },
      { id: "r", label: "Review tools", x: 244, y: 70, w: 70 },
    ],
    edges: [
      { from: "s", to: "o" },
      { from: "s", to: "e" },
      { from: "s", to: "v" },
      { from: "o", to: "r" },
      { from: "e", to: "r" },
      { from: "v", to: "r" },
    ],
  },

  /** Wide version shown under the Apolloon entry on the home page. */
  apolloonWide: {
    id: "apolloon-wide",
    alt: "Three event laptops on a wired LAN with no internet, each with Electron and SQLite. They find each other through UDP broadcasts and replicate a Raft log over WebSocket; a change is confirmed once two of the three store it. TV screens are browsers that read the live race from a laptop.",
    width: 820,
    height: 244,
    nodes: [
      { id: "a", label: "Timing laptop|Electron, SQLite", x: 40, y: 102, w: 150, h: 40 },
      { id: "b", label: "Queue desk|Electron, SQLite", x: 320, y: 28, w: 150, h: 40 },
      { id: "c", label: "Warm-up post|Electron, SQLite", x: 320, y: 176, w: 150, h: 40 },
      { id: "d", label: "TV screens|browser only", x: 620, y: 102, w: 140, h: 40 },
      { id: "lan", label: "Event LAN, no internet", x: 8, y: 6, w: 804, h: 232, kind: "group" },
    ],
    edges: [
      { from: "a", to: "b", label: "Raft log over WebSocket", arrows: "both" },
      { from: "a", to: "c", label: "UDP broadcast discovery", arrows: "both" },
      { from: "b", to: "c", label: "2 of 3 confirm", arrows: "both" },
      { from: "b", to: "d", dashed: true, label: "live race, tRPC" },
      { from: "c", to: "d", dashed: true },
    ],
  },

  apolloon: {
    id: "apolloon",
    alt: "Three event laptops, each with its own SQLite copy, find each other through UDP broadcasts and replicate a Raft log over WebSocket.",
    width: 320,
    height: 190,
    nodes: [
      { id: "a", label: "Timing|SQLite", x: 8, y: 20, w: 84, h: 44 },
      { id: "b", label: "Queue desk|SQLite", x: 228, y: 20, w: 84, h: 44 },
      { id: "c", label: "Warm-up|SQLite", x: 118, y: 126, w: 84, h: 44 },
    ],
    edges: [
      { from: "a", to: "b", label: "Raft over WebSocket", arrows: "both" },
      { from: "a", to: "c", label: "UDP discovery", arrows: "both" },
      { from: "b", to: "c", arrows: "both" },
    ],
  },

  awsFargateVault: {
    id: "aws",
    alt: "A public load balancer sends traffic to the app in a private Fargate task. A Vault Agent sidecar in the same task logs in to an external Vault with the task's IAM role and writes the secret to a file the app reads. Both containers log to CloudWatch.",
    width: 320,
    height: 190,
    nodes: [
      { id: "lb", label: "Load|balancer", x: 8, y: 74, w: 68, h: 44 },
      { id: "task", label: "Fargate task, 1 to 3", x: 96, y: 22, w: 124, h: 148, kind: "group" },
      { id: "app", label: "App", x: 116, y: 48, w: 84, h: 30 },
      { id: "ag", label: "Vault Agent", x: 116, y: 124, w: 84, h: 30 },
      { id: "v", label: "Vault|external|IAM login", x: 244, y: 111, w: 68, h: 56 },
      { id: "cw", label: "CloudWatch|logs", x: 244, y: 41, w: 68, h: 44 },
    ],
    edges: [
      { from: "lb", to: "app" },
      { from: "ag", to: "app", label: "file" },
      { from: "ag", to: "v", arrows: "both" },
      { from: "app", to: "cw", dashed: true },
    ],
  },

  financialAgent: {
    id: "agent",
    alt: "A React frontend talks to a streaming FastAPI orchestrator. The orchestrator calls eight MCP tools that change the portfolio in PostgreSQL, searches ChromaDB, and runs Qwen2.5 through Ollama.",
    width: 320,
    height: 190,
    nodes: [
      { id: "ui", label: "React", x: 8, y: 78, w: 60 },
      { id: "api", label: "FastAPI|orchestrator", x: 92, y: 70, w: 92, h: 50 },
      { id: "mcp", label: "MCP|8 tools", x: 208, y: 8, w: 64, h: 40 },
      { id: "pg", label: "PostgreSQL", x: 208, y: 76, w: 104, h: 38, kind: "cylinder" },
      { id: "rag", label: "ChromaDB", x: 208, y: 128, w: 104, h: 26, kind: "cylinder" },
      { id: "ol", label: "Ollama, Qwen2.5", x: 208, y: 162, w: 104, h: 24 },
    ],
    edges: [
      { from: "ui", to: "api", arrows: "both" },
      { from: "api", to: "mcp" },
      { from: "mcp", to: "pg" },
      { from: "api", to: "pg" },
      { from: "api", to: "rag" },
      { from: "api", to: "ol" },
    ],
  },

  azureMlops: {
    id: "azure",
    alt: "On Azure ML, fifteen parallel preparation jobs feed a split, training, and model registration. GitHub Actions downloads the registered model and runs FastAPI in Docker on a self-hosted runner.",
    width: 320,
    height: 190,
    nodes: [
      { id: "az", label: "Azure ML pipeline", x: 4, y: 4, w: 312, h: 96, kind: "group" },
      { id: "d1", label: "Prep", x: 12, y: 24, w: 48, h: 22 },
      { id: "d2", label: "Prep", x: 12, y: 50, w: 48, h: 22 },
      { id: "d3", label: "Prep", x: 12, y: 76, w: 48, h: 18 },
      { id: "sp", label: "Split", x: 92, y: 46, w: 56, h: 28 },
      { id: "tr", label: "Train CNN", x: 168, y: 46, w: 64, h: 28 },
      { id: "reg", label: "Register", x: 250, y: 46, w: 58, h: 28 },
      { id: "n", label: "15 parallel jobs", x: 4, y: 112, w: 64, h: 1, kind: "note" },
      { id: "gh", label: "GitHub|Actions", x: 8, y: 132, w: 76, h: 44 },
      { id: "rn", label: "Self-hosted runner", x: 120, y: 112, w: 196, h: 74, kind: "group" },
      { id: "api", label: "FastAPI|in Docker", x: 236, y: 132, w: 72, h: 44 },
      { id: "pg", label: "PostgreSQL", x: 136, y: 136, w: 76, h: 36, kind: "cylinder" },
    ],
    edges: [
      { from: "d1", to: "sp" },
      { from: "d2", to: "sp" },
      { from: "d3", to: "sp" },
      { from: "sp", to: "tr" },
      { from: "tr", to: "reg" },
      { from: "reg", to: "api" },
      { from: "api", to: "pg" },
      { from: "gh", to: "rn", label: "deploys" },
    ],
  },

  rustSemiSupervised: {
    id: "rust",
    alt: "A labeled set of 20% and an unlabeled set of 60% train a small CNN written with Rust and Burn. Confident predictions on the unlabeled set come back as pseudo labels. The model ships in a 26 MB offline binary and runs on an iPhone 12 in about 80 ms.",
    width: 320,
    height: 190,
    nodes: [
      { id: "l", label: "Labeled|20%", x: 8, y: 28, w: 72, h: 44 },
      { id: "u", label: "Unlabeled|60%", x: 8, y: 108, w: 72, h: 44 },
      { id: "m", label: "Small CNN|Rust, Burn", x: 116, y: 64, w: 88, h: 50 },
      { id: "pl", label: "pseudo labels when 90% sure", x: 8, y: 168, w: 196, h: 1, kind: "note" },
      { id: "p", label: "iPhone 12|80 ms|26 MB|offline", x: 240, y: 44, w: 72, h: 98, kind: "phone" },
    ],
    edges: [
      { from: "l", to: "m" },
      { from: "u", to: "m", dashed: true, arrows: "both" },
      { from: "m", to: "p" },
    ],
  },

  xpoChatbot: {
    id: "xpo",
    alt: "Scrapy collects the event websites. The .NET API embeds the content with Azure OpenAI, stores it in Cosmos DB, ranks it by cosine similarity, and answers through a chat widget. A Next.js dashboard reads the analytics.",
    width: 320,
    height: 190,
    nodes: [
      { id: "sc", label: "Scrapy|event sites", x: 8, y: 20, w: 76, h: 44 },
      { id: "w", label: "Chat widget|per event", x: 8, y: 124, w: 76, h: 44 },
      { id: "api", label: ".NET API|cosine search", x: 116, y: 68, w: 88, h: 44 },
      { id: "ai", label: "Azure OpenAI", x: 232, y: 20, w: 80 },
      { id: "db", label: "Cosmos DB", x: 232, y: 74, w: 80, h: 32, kind: "cylinder" },
      { id: "dash", label: "Next.js|dashboard", x: 232, y: 124, w: 80, h: 44 },
    ],
    edges: [
      { from: "sc", to: "api", label: "JSON" },
      { from: "w", to: "api", arrows: "both" },
      { from: "api", to: "ai", arrows: "both" },
      { from: "api", to: "db", arrows: "both" },
      { from: "dash", to: "api", dashed: true, label: "JWT" },
    ],
  },

  datasetQuery: {
    id: "dataset",
    alt: "PySide6 clients talk to a threaded server over TCP with pickled messages. The server keeps users and query history in PostgreSQL, runs queries on the arrest dataset in a pool of four workers, and has its own moderator window.",
    width: 320,
    height: 190,
    nodes: [
      { id: "c1", label: "Client", x: 8, y: 20, w: 64, h: 28 },
      { id: "c2", label: "Client", x: 8, y: 80, w: 64, h: 28 },
      { id: "c3", label: "Client", x: 8, y: 140, w: 64, h: 28 },
      { id: "s", label: "Server|thread per client", x: 112, y: 72, w: 100, h: 44 },
      { id: "mod", label: "Moderator|window", x: 112, y: 8, w: 100, h: 38 },
      { id: "q", label: "4 workers|pandas", x: 112, y: 140, w: 100, h: 40 },
      { id: "pg", label: "PostgreSQL", x: 240, y: 74, w: 72, h: 40, kind: "cylinder" },
      { id: "d", label: "LA arrests", x: 240, y: 142, w: 72, h: 36, kind: "cylinder" },
    ],
    edges: [
      { from: "c1", to: "s", arrows: "both" },
      { from: "c2", to: "s", arrows: "both", label: "TCP" },
      { from: "c3", to: "s", arrows: "both" },
      { from: "mod", to: "s", arrows: "both" },
      { from: "s", to: "q" },
      { from: "s", to: "pg" },
      { from: "q", to: "d" },
    ],
  },

  athas: {
    id: "athas",
    alt: "The editor's React and TypeScript side and its Tauri and Rust side, with the areas I changed written inside each. C# support sits on the interface side. Large-file streaming touches both sides, and input hardening sits in the core.",
    width: 320,
    height: 190,
    nodes: [
      { id: "ui", label: "React, TypeScript|image diffs, C#|Linux UI, leaks", x: 8, y: 24, w: 136, h: 64 },
      { id: "core", label: "Tauri, Rust|proxy port, SSH leaks|LSP race fix", x: 176, y: 24, w: 136, h: 64 },
      { id: "st", label: "Large-file|streaming", x: 40, y: 130, w: 104, h: 40 },
      { id: "sec", label: "Input|hardening", x: 208, y: 130, w: 104, h: 40 },
    ],
    edges: [
      { from: "ui", to: "core", arrows: "both" },
      { from: "st", to: "ui" },
      { from: "st", to: "core" },
      { from: "sec", to: "core" },
    ],
  },
} satisfies Record<string, Schematic>;

export type DrawingKey = keyof typeof drawings;
