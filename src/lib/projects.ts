import { basePath } from "./paths";

export interface Project {
  title: string;
  href: string;
  description: string;
  context?: string;
}

export const experience: Project[] = [
  {
    title: "Medical imaging at 2Ai IPCA",
    context: "AI & software engineering intern",
    href: `${basePath}work/medical-imaging.html`,
    description: "An international internship working with real clinical imaging data. I wrote a Python pipeline that reads measurements out of DICOM studies with OCR, along with review tools, resumable batch processing, ECG extraction, and a source-video matcher. Filtering candidates on metadata before aligning images cut one representative run from about 21 hours to 23 minutes.",
  },
  {
    title: "Apolloon 24-hour run system",
    context: "Software engineer, paid client work",
    href: `${basePath}work/apolloon.html`,
    description: "Software for running a 24-hour relay on the event's own network. Every Electron host has its own writable SQLite database. Hosts pair once, find each other again through signed UDP announcements on the LAN, and send each other only the operations the other side is missing, over authenticated HTTP.",
  },
];

export const selectedWork: Project[] = [
  {
    title: "AWS Fargate & Vault workload identity",
    href: `${basePath}work/aws-fargate-vault.html`,
    description: "Terraform for private ECS Fargate tasks behind an ALB, spread over two availability zones. Tasks log in to Vault with their IAM role, and the setup includes CloudWatch monitoring, autoscaling, health checks, and safeguards around deploys. The plans are tested against mocked providers.",
  },
  {
    title: "Financial AI agent",
    href: `${basePath}work/financial-agent.html`,
    description: "A chat app for a simulated investment portfolio, split over six services: a streaming FastAPI backend, tools behind MCP, RAG with ChromaDB, PostgreSQL, a React frontend, and local models through Ollama. We were two people on this school project. I did the backend architecture, orchestration, persistence, containers, and tests, plus most of the frontend integration.",
  },
  {
    title: "Azure ML lifecycle",
    href: `${basePath}work/azure-mlops.html`,
    description: "Solo MLOps coursework. Data preparation runs in parallel on Azure ML compute, runs are tracked with MLflow, and the registered model is served by FastAPI in Docker, with Kubernetes manifests and GitHub Actions for delivery.",
  },
  {
    title: "Semi-supervised learning in Rust",
    href: `${basePath}blog/blog.html`,
    description: "My bachelor research: classifying plant diseases on edge devices when only a small part of the data is labeled. The semi-supervised model scored 94.90% on a held-out test set and runs in an offline app of about 26 MB, which I tested on an iPhone.",
  },
  {
    title: "Event chatbot for XPO Group",
    href: `${basePath}work/xpo-chatbot.html`,
    description: "A school team project for an outside client. It's a full-stack RAG chatbot: Python scrapers collect the event content, a .NET API answers questions with Azure OpenAI and Cosmos DB, and a Next.js dashboard shows the analytics.",
  },
  {
    title: "Dataset query system",
    href: `${basePath}work/dataset-query.html`,
    description: "A Python client-server app for querying a shared dataset. It has logins, moderator tools, usage statistics, server broadcasts, and a PySide6 desktop interface.",
  },
];

export const openSource: Project[] = [
  {
    title: "Athas code editor",
    context: "Maintainer & contributor",
    href: `${basePath}work/athas.html`,
    description: "I work on both the React/TypeScript side and the Tauri/Rust side of the editor. My merged changes include C# language support, image diffs, Linux UI fixes, dynamic proxy ports, fixes for resource and memory leaks, and a fix for a race condition in the language server handling.",
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
