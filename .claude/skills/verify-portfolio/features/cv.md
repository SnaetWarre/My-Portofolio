# CV page

`cv.html` is the HTML version of the CV. It has a boxed toolbar (Portfolio, Download PDF, theme button), contact links, experience, projects, and a side column with education, skills and languages. On screen it follows the site theme. When printed it is always black on white.

## Sub-features

- `cv-screen` shows the CV in both themes at desktop and phone width.
- `cv-toolbar` links back to the portfolio, downloads `CV_Warre_Snaet.pdf`, and toggles the theme.
- `cv-print` prints on white, without the toolbar.

## How to get to it (user POV)

- Click `CV` in the top line of any page.
- Click `Read my CV` on the home page.

## Driving it with check.mjs

Preconditions: the baseline in the README. `npm run build` copies the PDFs into `dist/`, so they exist only after `serve.sh start`.

- **Screen.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/cv --pages cv.html --widths 1920,1280,900,390 --schemes light,dark --full`. Every line reads `ok`.
- **PDF link.** Run `curl -sI ${B}CV_Warre_Snaet.pdf | head -1` and `curl -sI ${B}CV_Warre_Snaet_ATS.pdf | head -1`. Both return `200`.
- **Print.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/cv-print --pages cv.html --widths 1280 --schemes dark --media print --full`. The PNG is black text on white even though the system theme is dark.

## Gotchas

- `--media print` emulates print CSS on screen. It does not paginate. For real page breaks, print to PDF with Chrome's `Page.printToPDF` or open the PDF.
- The downloadable PDFs come from `npm run build:cv`, not from `cv.astro`. Changing `cv.astro` does not change the PDFs.
