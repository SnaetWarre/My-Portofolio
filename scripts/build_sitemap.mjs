import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("dist");
const publicBase = new URL("https://snaetwarre.github.io/My-Portofolio/");

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? collectHtml(absolute) : [absolute];
  }));
  return files.flat().filter((file) => file.endsWith(".html"));
}

// The homepage content lives in a component; every other page maps to its own source file.
function sourceFiles(relative) {
  if (relative === "index.html") return ["src/pages/index.astro", "src/components/PortfolioHome.astro"];
  return [`src/pages/${relative.replace(/\.html$/, ".astro")}`].filter((file) => existsSync(file));
}

// Last commit that touched the page's source. CI needs a full clone (fetch-depth: 0) for this to be accurate.
function lastModified(files) {
  if (files.length === 0) return undefined;
  try {
    const date = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...files], { encoding: "utf8" }).trim();
    return date || undefined;
  } catch {
    return undefined;
  }
}

const escapeXml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const pages = [];
for (const file of await collectHtml(outputDir)) {
  const relative = path.relative(outputDir, file).split(path.sep).join("/");
  if (relative === "404.html") continue;
  const html = await readFile(file, "utf8");
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) continue;
  const route = relative === "index.html" ? "" : relative;
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  pages.push({ loc: new URL(route, publicBase).href, lastmod: lastModified(sourceFiles(relative)), image: ogImage });
}

pages.sort((left, right) => left.loc.localeCompare(right.loc));
const body = pages.map(({ loc, lastmod, image }) => [
  "  <url>",
  `    <loc>${escapeXml(loc)}</loc>`,
  lastmod && `    <lastmod>${lastmod}</lastmod>`,
  image && `    <image:image>\n      <image:loc>${escapeXml(image)}</image:loc>\n    </image:image>`,
  "  </url>",
].filter(Boolean).join("\n")).join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;
await writeFile(path.join(outputDir, "sitemap.xml"), sitemap);
console.log(`Generated sitemap.xml with ${pages.length} indexable pages`);
