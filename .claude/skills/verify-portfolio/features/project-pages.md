# Project pages

Each project has a case-study page under `work/`, in the same narrow column as the home page: a breadcrumb (warre snaet / work / slug), the heading with a grey tag under it, label/value facts (role, stack, setting), a lead paragraph, sections with a grey label over each heading, lists, bordered flow boxes and links, and at the bottom the next project and a link back to the list.

## Sub-features

- `case-header` shows the heading, the tag and the facts rows.
- `case-sections` shows the labelled sections, lists, flow boxes and outbound links.
- `case-next` links to the next project and back to `#work` on the home page.

## How to get to it (user POV)

- Click a project title on the home page.
- Click the next-project link at the bottom of another project page.
- Open one of `work/medical-imaging.html`, `work/apolloon.html`, `work/aws-fargate-vault.html`, `work/financial-agent.html`, `work/azure-mlops.html`, `work/xpo-chatbot.html`, `work/dataset-query.html`, `work/athas.html`.

## Driving it with check.mjs

Preconditions: the baseline in the README.

- **All pages.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/cases --pages work/medical-imaging.html,work/apolloon.html,work/aws-fargate-vault.html,work/financial-agent.html,work/azure-mlops.html,work/xpo-chatbot.html,work/dataset-query.html,work/athas.html --widths 1920,1280,900,390 --schemes light,dark`. Every line reads `ok`. No `text-overlap` or `squeezed-text`.
- **Look at the facts.** Open `work_financial-agent__390-light.png`. Each value wraps inside its own column next to its label.
- **Next project.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/cases-next --pages work/financial-agent.html --widths 1280 --eval "(() => { const a = [...document.querySelectorAll('main a')].filter(a => /\\/(work|blog)\\/[^/]+\\.html\$/.test(a.pathname)).at(-1); const href = a.href; a.click(); return href; })()"`. The output shows `now at` the URL from the eval result, and that page's PNG has its styles.

## Gotchas

- The breadcrumb's last step comes from the file name (`aws-fargate-vault` becomes `aws fargate vault`). Renaming a page renames its crumb.
- Page copy changes often. A longer role or stack line can bring layout bugs back without any style change, so rerun after copy edits too.
