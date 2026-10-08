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
    description: "I wrote a Python pipeline that reads the measurements burned into echocardiography DICOM studies with OCR, extracts ECG traces, and finds the video frame each measurement image came from. That last step is an image similarity search, and it took most of the run time. I sped up the frame preparation and rewrote OpenCV's ECC alignment in PyTorch so it runs in batches on the GPU. Together, that made the search 14.9 times faster on a benchmark of 39 images, from 1182 to 80 seconds. A review tool lets a person check every value. It was an international internship, working with real clinical imaging data.",
    drawing: { key: "dicomWide", placement: "below" },
  },
  {
    title: "Apolloon 24-hour run system",
    context: "software engineer, paid client work",
    href: `${basePath}work/apolloon.html`,
    description: "It runs a 24-hour relay on three laptops on the event's own network, with no cloud. Each Electron laptop holds the whole race in SQLite. The laptops find each other through UDP broadcasts and elect a leader by majority vote with Raft. A change counts once two of the three laptops store it, so any one laptop can die without losing a lap. I built it alone.",
    drawing: { key: "apolloonWide", placement: "below" },
  },
];

export const selectedWork: Project[] = [
  {
    title: "AWS Fargate and Vault workload identity",
    context: "Terraform on AWS",
    href: `${basePath}work/aws-fargate-vault.html`,
    description: "Terraform for private ECS Fargate tasks behind a public ALB, with subnets in two availability zones. In Vault mode, a Vault Agent sidecar logs in to an external Vault with the task's IAM role and hands the app the one secret it may read. It also sets up CloudWatch logs, CPU autoscaling from 1 to 3 tasks, and a deploy circuit breaker that rolls back. CI tests three plan variants against mocked providers and never deploys.",
    drawing: { key: "awsFargateVault", placement: "aside" },
  },
  {
    title: "Financial AI agent",
    context: "school project, team of two",
    href: `${basePath}work/financial-agent.html`,
    description: "A chat app for a simulated investment portfolio, made of six containers. A streaming FastAPI backend sorts messages into questions and trade commands. Questions go through RAG on ChromaDB, and trades go through eight MCP tools and need a confirmation. It uses PostgreSQL, a React frontend, and Qwen2.5 running locally through Ollama. I did the backend architecture, orchestration, persistence, containers and tests, and most of the frontend integration.",
  },
  {
    title: "Azure ML lifecycle",
    context: "solo MLOps coursework",
    href: `${basePath}work/azure-mlops.html`,
    description: "A CNN that sorts photos into 15 kinds of sports ball. An Azure ML pipeline prepares each class in a parallel job, splits the data, trains the model and registers it. GitHub Actions sets up Azure, runs the pipeline, serves the model with FastAPI in Docker, checks it with a test prediction, and deletes the Azure resources afterwards.",
  },
  {
    title: "Semi-supervised learning in Rust",
    context: "bachelor research, Rust and Burn",
    href: `${basePath}blog/blog.html`,
    description: "A small CNN in Rust that classifies 38 plant diseases, trained with only 20% of the images labeled. Pseudo-labeling on the rest raised test accuracy from 86.06% to 94.90%. The release binary is about 26 MB and runs offline, and the model takes about 80 ms per image on an iPhone 12.",
  },
  {
    title: "Event chatbot for Kortrijk Xpo",
    context: "school team project, lead developer",
    href: `${basePath}work/xpo-chatbot.html`,
    description: "A RAG chatbot for three trade fairs, built by a team of four for an outside client. I wrote most of it. A Scrapy pipeline collects the event websites. A .NET API embeds the content with Azure OpenAI, stores it in Cosmos DB, ranks it by cosine similarity, and answers with GPT-4. A Next.js dashboard shows the analytics.",
  },
  {
    title: "Dataset query system",
    context: "Python client-server app",
    href: `${basePath}work/dataset-query.html`,
    description: "Users log in and query a dataset of Los Angeles arrests through a PySide6 desktop app. The server handles each client in its own thread over TCP and runs the pandas queries in a worker pool. A separate server window shows who is connected and what they query, and can message one client or all of them.",
  },
];

export const openSource: Project[] = [
  {
    title: "Athas code editor",
    context: "contributor, 9 merged pull requests",
    href: `${basePath}work/athas.html`,
    description: "My largest change makes the editor, language servers and terminal stream large files. I also hardened how it handles untrusted input, added C# support, image diffs and dynamic proxy ports, and fixed Linux UI issues, resource and memory leaks, and a race condition in the language server handling. I work on the React and TypeScript side and on the Tauri and Rust side.",
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
