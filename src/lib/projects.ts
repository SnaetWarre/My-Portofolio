import { basePath } from "./paths";
import type { DrawingKey } from "./drawings";

export interface Project {
  title: string;
  href: string;
  description: string;
  /** Role or setting, shown after the title. */
  context?: string;
  /** Optional drawing on the home page and where it sits. */
  drawing?: { key: DrawingKey; placement: "aside" | "below" };
}

export const experience: Project[] = [
  {
    title: "Medical imaging at 2Ai IPCA",
    context: "AI and software engineering intern, Portugal",
    href: `${basePath}work/medical-imaging.html`,
    description: "Filtering candidates on metadata before aligning images cut one representative run from about 21 hours to 23 minutes. I wrote a Python pipeline that reads measurements out of DICOM studies with OCR. Around it I built review tools, resumable batch processing, ECG extraction and a matcher that finds the source video. It was an international internship, working with real clinical imaging data.",
    drawing: { key: "dicomWide", placement: "below" },
  },
  {
    title: "Apolloon 24-hour run system",
    context: "software engineer, paid client work",
    href: `${basePath}work/apolloon.html`,
    description: "It runs a 24-hour relay on the event's own network. Every Electron host has its own writable SQLite database. Hosts pair once and find each other again through signed UDP announcements on the LAN. Over authenticated HTTP, they send each other only the operations the other side is missing.",
  },
];

export const selectedWork: Project[] = [
  {
    title: "AWS Fargate and Vault workload identity",
    context: "Terraform on AWS",
    href: `${basePath}work/aws-fargate-vault.html`,
    description: "Private ECS Fargate tasks log in to Vault with their IAM role. The Terraform puts them behind an ALB, spread over two availability zones. It also sets up CloudWatch monitoring, autoscaling, health checks and safeguards around deploys. I tested the plans against mocked providers.",
    drawing: { key: "awsFargateVault", placement: "aside" },
  },
  {
    title: "Financial AI agent",
    context: "school project, team of two",
    href: `${basePath}work/financial-agent.html`,
    description: "Six services behind one chat app for a simulated investment portfolio. It has a streaming FastAPI backend, tools behind MCP, RAG with ChromaDB, PostgreSQL, a React frontend and local models through Ollama. I did the backend architecture, orchestration, persistence, containers and tests. I also did most of the frontend integration.",
  },
  {
    title: "Azure ML lifecycle",
    context: "solo MLOps coursework",
    href: `${basePath}work/azure-mlops.html`,
    description: "Data preparation runs in parallel on Azure ML compute, and MLflow tracks the runs. FastAPI serves the registered model from a Docker container. Kubernetes manifests and GitHub Actions handle delivery.",
  },
  {
    title: "Semi-supervised learning in Rust",
    context: "bachelor research, Rust and Burn",
    href: `${basePath}blog/blog.html`,
    description: "The model scored 94.90% on a held-out test set. It classifies plant diseases on edge devices, trained on data where only a small part is labeled. It runs in an offline app of about 26 MB, which I tested on an iPhone.",
  },
  {
    title: "Event chatbot for XPO Group",
    context: "school team project for XPO Group",
    href: `${basePath}work/xpo-chatbot.html`,
    description: "We built a full-stack RAG chatbot for an outside client. Python scrapers collect the event content. A .NET API answers questions with Azure OpenAI and Cosmos DB. A Next.js dashboard shows the analytics.",
  },
  {
    title: "Dataset query system",
    context: "Python client-server app",
    href: `${basePath}work/dataset-query.html`,
    description: "Users query a shared dataset through a Python client and server. It has logins, moderator tools, usage statistics and server broadcasts. The desktop interface uses PySide6.",
  },
];

export const openSource: Project[] = [
  {
    title: "Athas code editor",
    context: "maintainer and contributor",
    href: `${basePath}work/athas.html`,
    description: "I added C# language support, image diffs and dynamic proxy ports. I fixed Linux UI issues, resource and memory leaks, and a race condition in the language server handling. All of it is merged. I work on the React and TypeScript side and on the Tauri and Rust side.",
  },
];

export const writing: Project[] = [
  {
    title: "How I built a 26 MB offline AI with Rust and Burn",
    context: "blog post",
    href: `${basePath}blog/blog.html`,
    description: "It covers my bachelor project. It starts with the semi-supervised training and ends with the model running offline on a phone.",
  },
];

/** Every project page in the order the home page lists them. */
const readingOrder = [...experience, ...selectedWork, ...openSource];

/** The project listed after the given page on the home page, wrapping to the first. */
export function nextProject(href: string): Project | undefined {
  const index = readingOrder.findIndex((project) => project.href === href);
  if (index === -1) return undefined;
  return readingOrder[(index + 1) % readingOrder.length];
}
