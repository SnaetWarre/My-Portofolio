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

const pages = [];
for (const file of await collectHtml(outputDir)) {
  const relative = path.relative(outputDir, file).split(path.sep).join("/");
  if (relative === "404.html") continue;
  const html = await readFile(file, "utf8");
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) continue;
  const route = relative === "index.html" ? "" : relative;
  pages.push(new URL(route, publicBase).href);
}

pages.sort((left, right) => left.localeCompare(right));
const body = pages.map((page) => `  <url>\n    <loc>${page}</loc>\n  </url>`).join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
await writeFile(path.join(outputDir, "sitemap.xml"), sitemap);
console.log(`Generated sitemap.xml with ${pages.length} indexable pages`);
