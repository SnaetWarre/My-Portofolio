export type NodeId = "identity" | "projects" | "about" | "blog" | "cv" | "contact";

export type PanelType = NodeId;

export type WorldNode = {
  id: NodeId;
  label: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  panelType?: PanelType;
  accentPalette: {
    glow: string;
    fog: string;
    particle: string;
  };
};

export type ProjectEntry = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  links: { label: string; href: string }[];
  featured: boolean;
  sceneNodeId?: string;
};

export const worldNodes: WorldNode[] = [
  {
    id: "identity",
    label: "Identity Nucleus",
    position: [0, 0, 0],
    cameraTarget: [0, 0.25, 0],
    panelType: "identity",
    accentPalette: { glow: "#ffd6a3", fog: "#ff8a3d", particle: "#f7fbff" },
  },
  {
    id: "projects",
    label: "Project Specimens",
    position: [-8.8, 2.1, -6.2],
    cameraTarget: [-7.8, 1.6, -5.7],
    panelType: "projects",
    accentPalette: { glow: "#89b4ff", fog: "#8f63ff", particle: "#f7fbff" },
  },
  {
    id: "about",
    label: "Neural Archive",
    position: [6.6, -3.9, -7.5],
    cameraTarget: [5.9, -3.2, -6.7],
    panelType: "about",
    accentPalette: { glow: "#8f63ff", fog: "#89b4ff", particle: "#f7fbff" },
  },
  {
    id: "blog",
    label: "Research Signal",
    position: [3.6, 5.2, -9.6],
    cameraTarget: [3.1, 4.4, -8.8],
    panelType: "blog",
    accentPalette: { glow: "#ff8a3d", fog: "#ffd6a3", particle: "#f7fbff" },
  },
  {
    id: "cv",
    label: "Credential Cell",
    position: [-4.6, -4.8, -7.2],
    cameraTarget: [-4.1, -4.1, -6.6],
    panelType: "cv",
    accentPalette: { glow: "#f7fbff", fog: "#89b4ff", particle: "#ffd6a3" },
  },
  {
    id: "contact",
    label: "Contact Receptor",
    position: [9.2, 1.1, -4.4],
    cameraTarget: [8.2, 0.9, -4],
    panelType: "contact",
    accentPalette: { glow: "#ffd6a3", fog: "#ff8a3d", particle: "#89b4ff" },
  },
];

export const projects: ProjectEntry[] = [
  {
    slug: "rust-semi-supervised-learning",
    title: "Semi-Supervised Learning in Rust",
    summary:
      "Plant disease classification built in Rust with Burn, optimized for local edge devices. 0.39ms inference, 2579 FPS, and iPhone deployment.",
    stack: ["Rust", "Burn", "Edge AI", "SSL", "WASM", "Tauri"],
    links: [
      { label: "Read write-up", href: "blog/blog.html" },
      {
        label: "View project",
        href: "https://github.com/SnaetWarre/Research_Project_Rust_Semi-Supervised_Learning",
      },
    ],
    featured: true,
    sceneNodeId: "projects",
  },
  {
    slug: "financial-ai-agent",
    title: "Financial AI Agent",
    summary:
      "Conversational portfolio manager with natural-language analysis, market data, streaming responses, RAG memory, and session persistence.",
    stack: ["Python", "FastAPI", "React", "ChromaDB", "MCP", "Ollama"],
    links: [{ label: "View project", href: "https://github.com/SnaetWarre/Financial_AI_Agent" }],
    featured: true,
    sceneNodeId: "projects",
  },
  {
    slug: "event-chatbot",
    title: "Event Chatbot - XPO Group",
    summary:
      "Full-stack RAG system for event Q&A using .NET embeddings, Azure OpenAI, CosmosDB, Next.js analytics, and Scrapy ingestion.",
    stack: [".NET", "Azure OpenAI", "CosmosDB", "Next.js", "Python"],
    links: [{ label: "View project", href: "https://github.com/SnaetWarre/Industry-Project-Xpo-Group" }],
    featured: true,
    sceneNodeId: "projects",
  },
  {
    slug: "wateradventure",
    title: "WaterAdventure",
    summary:
      "Platform connecting swim coaches and parents for toddler water-confidence training, achievements, activity planning, chat, and multilingual support.",
    stack: ["SvelteKit", "TypeScript", "Prisma", "PostgreSQL", "Docker"],
    links: [{ label: "View project", href: "https://github.com/ElliotHeyse/TeamProject_waterAdventure" }],
    featured: false,
    sceneNodeId: "projects",
  },
  {
    slug: "dataset-query-socket-app",
    title: "Dataset Query Socket App",
    summary:
      "Client-server dataset analysis app with authentication, moderator controls, LAPD arrest data queries, stats, broadcast messages, and a Qt GUI.",
    stack: ["Python", "PySide6", "Sockets", "Pandas"],
    links: [{ label: "View project", href: "https://github.com/SnaetWarre/Server-Client-Python" }],
    featured: false,
    sceneNodeId: "projects",
  },
];

export const profileLinks = {
  github: "https://github.com/SnaetWarre",
  linkedin: "https://www.linkedin.com/in/warre-snaet-272354370/",
  email: "mailto:warresnaet@student.howest.be",
  cv: "CV_Warre_Snaet.pdf",
  blog: "blog/blog.html",
};
