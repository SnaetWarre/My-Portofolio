# Home page

The home page shows the name in a drafting title block with three facts (based in, works in, looking for), a short intro with Copy email and Read my CV, and lists of work, projects, open source and writing. A few entries carry an architecture drawing. `obsidian.html` renders the same page as an experimental variant.

## Sub-features

- `home-title` shows the name, the tagline and three fact cells. On phones the cells become rows with the label on the left.
- `home-intro` shows the intro text, Copy email and Read my CV.
- `home-lists` shows the Work, Projects, Open source and Writing sections, each entry linking to its page.
- `home-drawings` shows the SVG drawings (medical imaging pipeline, Apolloon network, AWS Fargate).
- `home-copy` copies the email address and shows a status message.

## How to get to it (user POV)

- Open `/My-Portofolio/`.
- Click `Warre Snaet` or `Back to the list` on any project page.
- Click `Work` in the top line of any project page (goes to `#work`).

## Driving it with check.mjs

Preconditions: the baseline in the README.

- **Layout.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/home --pages "",obsidian.html --widths 1920,1280,900,390 --schemes light,dark --full`. Every line reads `ok`. In the PNGs the three fact cells sit to the right of the name on desktop and as rows on phones. Copy email and Read my CV sit in one row right under the intro text. Until 2026-10-09 they floated alone at the far right of the page.
- **Copy email.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/home-copy --pages "" --widths 1280 --eval "(async () => { document.querySelector('[data-copy-email]').click(); await new Promise(r => setTimeout(r, 400)); const n = document.querySelector('#copy-notification'); return { toast: n.textContent, hidden: n.hidden, clipboard: await navigator.clipboard.readText() }; })()"`. The result shows `toast: "Copied warresnaet@icloud.com"`, `hidden: false`, and the same address in the clipboard.
- **Open a project.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/home-nav --pages "" --widths 1280 --eval "document.querySelector('a[href\$=\"work/financial-agent.html\"]').click()"`. The output shows `now at .../work/financial-agent.html` and the PNG shows that page with its styles.

## Gotchas

- On the home page the top line has no `Work` link, only GitHub, LinkedIn, CV and the theme button.
- There are two Copy email buttons (intro and page end). `querySelector` picks the first.
- Drawings are below the first screen. Use `--full` or you will not see them.
- `--full` makes the window as tall as the page. Anything sized in viewport units looks stretched in that capture, so judge those parts from a normal capture.
