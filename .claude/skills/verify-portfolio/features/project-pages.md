# Project pages

Each project has a case-study page under `work/`: a drawing at the top, a title block with the project name, a one-line tag and three cells (role, stack, scope), a lead paragraph, labelled sections with text, lists, figures and links, and at the bottom a link to the next project and back to the list.

## Sub-features

- `case-drawing` shows the SVG architecture drawing for the page.
- `case-title` shows the name and tag on the left and the three cells on the right. Long cell text wraps inside its cell and never pushes the name aside. On phones the cells become label/value rows.
- `case-sections` shows the labelled sections, lists, figures and outbound links.
- `case-next` links to the next project and back to `#work` on the home page.

## How to get to it (user POV)

- Click a project title on the home page.
- Click the next-project link at the bottom of another project page.
- Open one of `work/medical-imaging.html`, `work/apolloon.html`, `work/aws-fargate-vault.html`, `work/financial-agent.html`, `work/azure-mlops.html`, `work/xpo-chatbot.html`, `work/dataset-query.html`, `work/athas.html`.

## Driving it with check.mjs

Preconditions: the baseline in the README.

- **All pages, both sides of the breakpoint.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/cases --pages work/medical-imaging.html,work/apolloon.html,work/aws-fargate-vault.html,work/financial-agent.html,work/azure-mlops.html,work/xpo-chatbot.html,work/dataset-query.html,work/athas.html --widths 1920,1280,900,390 --schemes light,dark`. Every line reads `ok`. No `collapsed-box`, `text-overlap` or `squeezed-text`.
- **Look at the title block.** Open `work_financial-agent__1920-light.png` and `work_aws-fargate-vault__900-light.png`. The name reads on one to four lines at full size, with the cells beside it, not on top of it.
- **Next project.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/cases-next --pages work/financial-agent.html --widths 1280 --eval "(() => { const a = [...document.querySelectorAll('main a')].filter(a => /\\/(work|blog)\\/[^/]+\\.html\$/.test(a.pathname)).at(-1); const href = a.href; a.click(); return href; })()"`. The output shows `now at` the URL from the eval result, and that page's PNG has its styles.

## Gotchas

- The title block is shared with the home page and 404 (`TitleBlock.astro`, styles in `portfolioStyles.ts`). A fix for one page must be checked on all of them.
- The pages with the longest cells are `financial-agent`, `aws-fargate-vault`, `xpo-chatbot` and `dataset-query`. Before the 2026-10-08 fix those four had a 0 px wide name column at 1280 and 1920.
- Page copy changes often. A longer role or stack line can bring layout bugs back without any style change, so rerun after copy edits too.
- The financial-agent page also has a raster figure, `images/financial-agent-architecture.png`. A missing file shows as `broken-image`.
