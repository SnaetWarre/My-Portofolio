import * as stylex from "@stylexjs/stylex";

// --paper and --ink are set in appearance.css and switch with the theme.
export const colorTokens = stylex.defineVars({
  background: "rgb(var(--paper))",
  foreground: "rgb(var(--ink))",
  muted: "rgb(var(--ink) / 6%)",
  mutedForeground: "rgb(var(--ink) / 66%)",
  border: "rgb(var(--ink) / 44%)",
  borderLight: "rgb(var(--ink) / 16%)",
  accent: "rgb(var(--ink))",
  accentHover: "rgb(var(--ink) / 80%)",
});

export const typographyTokens = stylex.defineVars({
  bodyFont: '"IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
  monospaceFont: 'ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace',
});

export const layoutTokens = stylex.defineVars({
  contentMeasure: "43rem",
  pageWidth: "70rem",
  pageGutter: "1.25rem",
  sectionGap: "2.5rem",
});

// The CV follows the site theme on screen. In print, appearance.css resets
// paper and ink to white and black, so these print as before.
export const cvColorTokens = stylex.defineVars({
  secondaryInk: "rgb(var(--ink) / 68%)",
  subtleRule: "rgb(var(--ink) / 26%)",
  screenCanvas: "rgb(var(--paper))",
  sheet: "color-mix(in srgb, rgb(var(--paper)), rgb(var(--ink)) 4%)",
});
