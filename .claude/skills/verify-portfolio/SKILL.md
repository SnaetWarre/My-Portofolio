---
name: verify-portfolio
description: Build and check Warre Snaet's Astro portfolio (snaetwarre.github.io/My-Portofolio) in headless Chrome. Screenshots every page at desktop and phone widths and flags overlapping text, collapsed or squeezed columns, horizontal scroll, broken images, 404s and JS errors. Use after any change to styles, layouts, components or page copy, when the user says a page looks broken, or before pushing (main deploys straight to GitHub Pages).
---

# Verify the portfolio

The site is static Astro + StyleX. What a visitor touches is the built HTML in `dist/`, served under `/My-Portofolio/`. Verification means: build, serve `dist/` on a private port, load each page in headless Chrome, and read the report and the screenshots.

Two helpers live in `scripts/` (paths below are relative to the repo root):

- `.claude/skills/verify-portfolio/scripts/serve.sh start [port] | status | stop` builds the site and runs `astro preview` on port 4399 by default.
- `.claude/skills/verify-portfolio/scripts/check.mjs <baseUrl> <outDir> [flags]` drives headless Chrome, writes a PNG per page, width and scheme, writes `report.json`, and exits 1 if anything failed.

## Launch

```bash
S=.claude/skills/verify-portfolio/scripts
$S/serve.sh start          # npm run build, then astro preview on 127.0.0.1:4399
```

It is ready when it prints `ready: http://127.0.0.1:4399/My-Portofolio/`. The build log is `/tmp/verify-portfolio/build.log` and the server log is `/tmp/verify-portfolio/preview.log`. After you change source files, run `stop` then `start` again: preview serves the old `dist/` until you rebuild.

Everything is headless. Nothing opens on the user's screen. The user often runs `npm run dev` on port 4321, so leave that alone. If 4399 is taken by something you did not start, `serve.sh` refuses; pass another port (`$S/serve.sh start 4410`).

## Doctor

```bash
$S/serve.sh status
```

This prints the pid, the port, the HTTP code of the home page, when `dist/` was built and the git HEAD. Drive only when the code is 200 and the build time is after your last edit. If it says `not running`, start it.

## Drive

Check every page (all `.html` files in `dist/`) at 1920, 1280 and 390 px wide, light theme:

```bash
$S/check.mjs http://127.0.0.1:4399/My-Portofolio/ /tmp/verify-portfolio/evidence/$(date +%H%M%S)
```

Useful flags:

- `--pages "",work/financial-agent.html,cv.html` checks only these paths. `""` is the home page.
- `--widths 1920,1280,900,390` sets the window widths. 860 px is the breakpoint where layouts switch to one column, so 900 and 390 cover both sides of it.
- `--schemes light,dark` covers both themes.
- `--full` captures the whole page instead of the first screen. Use it to look at drawings and sections further down.
- `--eval "<js>"` runs an expression after load. Use it to click as a user would, for example `document.querySelector('[data-theme-toggle]').click()`. The return value is printed as `eval-result`. If the click navigates, the checks and screenshot run on the new page and the output shows `now at <url>`.
- `--media print` emulates print. The CV must print on white.

What it flags:

| kind | meaning |
|---|---|
| `text-overlap` | Text drawn on top of other text. |
| `collapsed-box` | Text inside a box with no width, spilling out. This was the title-block bug on 2026-10-08. |
| `squeezed-text` | A short phrase wrapping almost word by word in a column under 200 px. |
| `overflow-x` | The page scrolls sideways; lists the elements that stick out. |
| `clipped-text` | Text cut off by its own box. |
| `broken-image`, `http-error`, `request-failed` | Missing assets or 404s. |
| `js-error`, `console-error` | Scripts failing. |

The checks skip text hidden on purpose: screen-reader-only headings, the off-screen skip link, and KaTeX formulas.

A clean report is not the whole proof. Open the PNGs of the pages you changed and look at them. The checker cannot judge spacing, alignment or whether a drawing still makes sense.

## Evidence

Put every run in `/tmp/verify-portfolio/evidence/<name>/`. A run directory holds the PNGs (`work_financial-agent__1920-light.png`) and `report.json`, which lists every page, width, scheme, final URL and problem. For a fix, keep a `before` run and an `after` run and compare the same file names.

Proof standards:

- Check the built site, which is what GitHub Pages serves. The dev server also injects StyleX styles in a different way, so a dev-only check proves less.
- For interactive features, click the real control with `--eval`. Record the state before and after in the return value, and capture the screenshot of the result.
- For navigation, click the link from the page a visitor starts on. Do not load the target URL directly. A dev-only bug on 2026-10-03 removed all styles after an in-site navigation.
- After a fix, rerun the whole site, not just the page you touched. The title block, top line and page end are shared by many pages.

## Cleanup

```bash
$S/serve.sh stop
```

This kills only the process group that `serve.sh` started, using `/tmp/verify-portfolio/preview.pid`. `check.mjs` kills its own Chrome and deletes its temporary profile when it exits. Evidence under `/tmp/verify-portfolio/evidence/` stays. `dist/` is gitignored and can stay.

Never stop servers with `pkill -f astro` or `pgrep -f astro.mjs` inside a Bash call: the pattern matches the calling shell's own command line and kills it. If you must find a stray server, use a bracket pattern such as `pgrep -af '[a]stro preview'` and kill by pid, and only if you started it.

## Feature map

`features/README.md` lists the user-facing features and how to verify each one. Read the matching file before you drive a feature, and update it when the site changes.
