# Home page

The home page follows shadcn.com: one narrow column on the left with a breadcrumb top line (warre snaet / github / linkedin / cv, theme button on the right), three short intro lines and a paragraph, grey Copy email and Read my CV buttons, then Work, Projects, Open source, Writing and Contact. Only links are underlined; section headings are plain. `obsidian.html` renders the same page as an experimental variant.

## Sub-features

- `home-intro` shows the intro lines (the first is the page's h1), the paragraph, Copy email and Read my CV.
- `home-lists` shows the Work, Projects, Open source and Writing sections. Each entry title is an underlined link with the role in grey under it.
- `home-contact` shows the email link, Copy email, LinkedIn and the ATS CV.
- `home-copy` copies the email address and shows a status message.

## How to get to it (user POV)

- Open `/My-Portofolio/`.
- Click `warre snaet` or `Back to the list` on any project page.
- Click `work` in the top line of any project page (goes to `#work`).

## Driving it with check.mjs

Preconditions: the baseline in the README.

- **Layout.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/home --pages "",obsidian.html --widths 1920,1280,900,390 --schemes light,dark --full`. Every line reads `ok`. In the PNGs the column stays 26rem wide at the left, the theme button sits at the right end of the top line, and no intro line wraps on desktop.
- **Copy email.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/home-copy --pages "" --widths 1280 --eval "(async () => { document.querySelector('[data-copy-email]').click(); await new Promise(r => setTimeout(r, 400)); const n = document.querySelector('#copy-notification'); return { toast: n.textContent, hidden: n.hidden, clipboard: await navigator.clipboard.readText() }; })()"`. The result shows `toast: "Copied warresnaet@icloud.com"`, `hidden: false`, and the same address in the clipboard.
- **Open a project.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/home-nav --pages "" --widths 1280 --eval "document.querySelector('a[href\$=\"work/financial-agent.html\"]').click()"`. The output shows `now at .../work/financial-agent.html` and the PNG shows that page with its styles.

## Gotchas

- On the home page `warre snaet` in the top line is plain text, not a link. The trail lists github, linkedin and cv instead of a `work` step.
- There are two Copy email buttons (intro and contact). `querySelector` picks the first.
- The first intro line is long. A longer job title or name there wraps it on desktop, which breaks the three-line look.
- `--full` makes the window as tall as the page. Anything sized in viewport units looks stretched in that capture, so judge those parts from a normal capture.
