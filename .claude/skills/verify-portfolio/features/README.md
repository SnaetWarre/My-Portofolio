# Portfolio verification map

This directory lists what a visitor can do on the portfolio and how to prove each part works. Read this index first, then the feature file that matches your change.

## Baseline preconditions

- Start the built site with `.claude/skills/verify-portfolio/scripts/serve.sh start`. It answers at `http://127.0.0.1:4399/My-Portofolio/`.
- `serve.sh status` returns code 200 and a build time after your last edit.
- Every Chrome that `check.mjs` starts has a fresh profile. Theme choices and clipboard contents do not carry over between runs.
- Never drive the user's own dev server on port 4321.

## Driving conventions

- All commands below assume `S=.claude/skills/verify-portfolio/scripts` and `B=http://127.0.0.1:4399/My-Portofolio/`.
- Use stable handles: `[data-theme-toggle]`, `[data-copy-email]`, `#copy-notification`, section ids `#work`, `#projects`, `#open-source`, `#writing`, and link `href` endings such as `a[href$="work/athas.html"]`.
- Click real controls with `--eval`. Do not call internal functions or set `data-theme` by hand.
- Return the before and after state from the `--eval` expression so it lands in the report.

## Proof and skip reporting

- A proof is a run directory under `/tmp/verify-portfolio/evidence/` with the PNGs and `report.json`.
- Name the feature and the entry point you drove.
- Look at the PNGs of what you changed. A clean report alone does not prove the layout looks right.
- If you could not reach an entry point, say which one and why. Do not report it as verified through another path.

## Feature entry contract

Each feature file starts with an H1 and one paragraph about what the visitor sees. It then has four H2 sections in this order: `Sub-features`, `How to get to it (user POV)`, `Driving it with check.mjs`, `Gotchas`.

## Features

- [Home page](./home.md) covers the title block, intro, project lists with drawings, and Copy email.
- [Project pages](./project-pages.md) covers the eight case studies: drawing, title block, sections, and the link to the next project.
- [Theme toggle](./theme-toggle.md) covers the Dark/Light button, the saved choice, and the system theme.
- [CV page](./cv.md) covers the on-screen CV, its toolbar, the PDF download and the print layout.
- [Blog post](./blog.md) covers the long write-up with KaTeX formulas.
