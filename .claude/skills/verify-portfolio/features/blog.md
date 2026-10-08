# Blog post

`blog/blog.html` is the long write-up on semi-supervised plant disease detection in Rust. It has headings, paragraphs, figures and KaTeX formulas, and is linked from the Writing section of the home page.

## Sub-features

- `blog-layout` reads well at desktop and phone width in both themes.
- `blog-math` renders formulas with KaTeX, with no raw TeX showing.
- `blog-figures` loads every image under `public/blog/`.

## How to get to it (user POV)

- Click the entry in the Writing section of the home page (`#writing`).
- Open `/My-Portofolio/blog/blog.html`.

## Driving it with check.mjs

Preconditions: the baseline in the README.

- **Layout and images.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/blog --pages blog/blog.html --widths 1920,1280,390 --schemes light,dark`. Every line reads `ok`, with no `broken-image` or `overflow-x`.
- **Math.** Run `$S/check.mjs $B /tmp/verify-portfolio/evidence/blog-math --pages blog/blog.html --widths 1280 --eval "({ formulas: document.querySelectorAll('.katex').length, rawTeX: document.body.innerText.includes('\\\\frac') })"`. The result shows a non-zero `formulas` count and `rawTeX: false`.
- **Look.** Run the layout command again with `--full` and open the PNG to check that the figures and formulas sit in the text column.

## Gotchas

- The checker skips text inside `.katex`, because KaTeX stacks glyphs on purpose. Check formulas by eye in the `--full` capture.
- Wide formulas may scroll inside their own box on phones. That is fine as long as the page itself reports no `overflow-x`.
