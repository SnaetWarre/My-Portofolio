# Theme toggle

The top line of every page has a button named after the theme it switches to (`Dark` or `Light`). Clicking it switches the whole page with a circular wipe, saves the choice in `localStorage` under `portfolio-theme`, and keeps it on other pages. Without a saved choice the site follows the system colour scheme.

## Sub-features

- `theme-system` follows `prefers-color-scheme` when nothing is saved.
- `theme-click` switches the theme, flips the button text and `aria-pressed`.
- `theme-persist` keeps the choice after navigating to another page.

## How to get to it (user POV)

- Click `Dark` or `Light` at the right end of the top line on any page.
- On the CV page the same button sits in the boxed toolbar.

## Driving it with check.mjs

Preconditions: the baseline in the README. Each run starts with nothing saved.

- **System theme.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/theme-system --pages "" --widths 1280 --schemes light,dark`. The light PNG has a light paper background and the button says `Dark`. The dark PNG is dark and the button says `Light`.
- **Click.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/theme-click --pages "" --widths 1280 --eval "(async () => { const b = document.querySelector('[data-theme-toggle]'); const before = [document.documentElement.dataset.theme ?? null, b.textContent]; b.click(); await new Promise(r => setTimeout(r, 1500)); return { before, after: [document.documentElement.dataset.theme, b.textContent, b.getAttribute('aria-pressed')], saved: localStorage.getItem('portfolio-theme') }; })()"`. The result shows `before: [null, "Dark"]`, `after: ["dark", "Light", "true"]`, `saved: "dark"`, and the PNG is dark.
- **Persist across pages.** Click the button, then click `CV` and wait for the new page. Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/theme-persist --pages "" --widths 1280 --eval "(async () => { document.querySelector('[data-theme-toggle]').click(); await new Promise(r => setTimeout(r, 1500)); const loaded = new Promise(r => document.addEventListener('astro:page-load', r, { once: true })); document.querySelector('a[href\$=\"cv.html\"]').click(); await loaded; const b = document.querySelector('[data-theme-toggle]'); return { path: location.pathname, theme: document.documentElement.dataset.theme, button: b.textContent, pressed: b.getAttribute('aria-pressed') }; })()"`. The result shows `path: "/My-Portofolio/cv.html"`, `theme: "dark"`, `button: "Light"`, `pressed: "true"`, and the CV PNG is dark.

## Gotchas

- The wipe animation runs for about a second. Wait at least 1.5 s before reading the state or the screenshot shows half of each theme.
- The button text names the target theme, not the current one.
- With `prefers-color-scheme: dark` the first click goes to light.
- Links inside the site use Astro's client-side router: the page swaps without a reload and inline scripts do not run again. Any script that keeps a reference to an element goes stale after the first click. Until 2026-10-08 the theme button kept saying `Dark` on a dark page after navigating. Always test the button after a navigation, not only on a fresh load.
- Because the document stays the same during client-side navigation, one `--eval` can click a link, await `astro:page-load`, and read the new page.
