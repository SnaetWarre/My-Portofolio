# Warre Snaet
**Junior Backend & Applied AI Engineer | Python**

> 🚧 **This profile is just the code storage.**
> The real breakdown of my projects, deep-dive case studies, and edge-AI research is on my portfolio.

### 👉 [snaetwarre.github.io/My-Portofolio](https://snaetwarre.github.io/My-Portofolio/)

---

### What I'm Building
I build dependable software around applied AI: Python backends, data pipelines, computer vision, APIs, validation tools, and deployable applications.
*   **Currently:** Open to junior backend, software, data, and applied AI engineering roles.
*   **Education:** Graduated with distinction in AI Engineering from Howest.
*   **Recent work:** A medical-imaging OCR and source-matching pipeline at 2Ai IPCA, plus a paid local-first race operations platform.
*   **On the side:** Exploring Rust, Burn, and edge AI through personal projects.

**Don't read the code, read the story:**
[**Read my technical write-up: "Semi-Supervised Plant Disease Detection in Rust"** →](https://snaetwarre.github.io/My-Portofolio/blog/blog.html)

---

[LinkedIn](https://www.linkedin.com/in/warre-snaet-272354370/) • [Email](mailto:warresnaet@icloud.com)

### Updating the CV

The published HTML CV is [`src/pages/cv.astro`](src/pages/cv.astro), with its
StyleX rules in [`src/styles/cvStyles.ts`](src/styles/cvStyles.ts). The separate
downloadable PDF and application variants are generated from the document
sources in the repository root and [`cv-variants/`](cv-variants/).

```bash
uv sync
npm run build:cv
npm run build
```

`uv sync` creates and updates the locked local Python environment. The CV script
regenerates the downloadable PDFs and application variants. The Astro build
generates `cv.html` from the Astro/StyleX source and copies only the public PDFs
into `dist/`.

### Building the site

The portfolio uses Astro layouts and components with StyleX, then builds to
static HTML and extracted atomic CSS. No client framework is shipped to visitors.

```bash
npm install
npm run dev
npm run check
npm run build
```
