import { execFileSync } from "node:child_process";
import { basePath } from "./paths";

/** Absolute URL of the portfolio root, e.g. https://snaetwarre.github.io/My-Portofolio/ */
export const siteUrl = new URL(basePath, import.meta.env.SITE).href;

export const absoluteUrl = (path = "") => new URL(path.replace(/^\/+/, ""), siteUrl).href;

export const personId = `${siteUrl}#person`;
export const websiteId = `${siteUrl}#website`;

export const profileLinks = {
  linkedIn: "https://www.linkedin.com/in/warre-snaet-272354370/",
  gitHub: "https://github.com/SnaetWarre",
};

export const person = {
  "@type": "Person",
  "@id": personId,
  name: "Warre Snaet",
  givenName: "Warre",
  familyName: "Snaet",
  url: siteUrl,
  jobTitle: "Junior Backend and Applied AI Engineer",
  description: "Backend and applied AI engineer from Belgium working on Python backends, data pipelines, agent infrastructure, and machine learning.",
  email: "mailto:warresnaet@icloud.com",
  address: { "@type": "PostalAddress", addressLocality: "Vilvoorde", addressCountry: "BE" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Howest University of Applied Sciences" },
  knowsAbout: [
    "Python", "FastAPI", "Machine learning", "Computer vision", "OCR", "MLOps",
    "Retrieval-augmented generation", "Model Context Protocol", "Rust", "AWS", "Azure",
    "Terraform", "Docker", "Kubernetes",
  ],
  knowsLanguage: ["nl", "en", "fr"],
  sameAs: [profileLinks.linkedIn, profileLinks.gitHub],
};

export const website = {
  "@type": "WebSite",
  "@id": websiteId,
  url: siteUrl,
  name: "Warre Snaet",
  alternateName: "Warre Snaet portfolio",
  inLanguage: "en",
  author: { "@id": personId },
  publisher: { "@id": personId },
};

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

/** First and last commit dates for a source file, or undefined outside a full Git checkout. */
export function gitDates(file: string): { created: string; modified: string } | undefined {
  try {
    const log = execFileSync("git", ["log", "--follow", "--format=%cI", "--", file], { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
    if (log.length === 0) return undefined;
    return { created: log.at(-1)!, modified: log[0] };
  } catch {
    return undefined;
  }
}
