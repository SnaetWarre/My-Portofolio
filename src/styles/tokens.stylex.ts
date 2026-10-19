import * as stylex from "@stylexjs/stylex";

// The triplets are set in appearance.css and switch with the theme.
export const colorTokens = stylex.defineVars({
  background: "rgb(var(--paper))",
  foreground: "rgb(var(--ink))",
  // Running text, a step softer than headings.
  text: "rgb(var(--text))",
  mutedForeground: "rgb(var(--muted))",
  muted: "rgb(var(--surface))",
  border: "rgb(var(--line))",
  control: "rgb(var(--control))",
  controlBorder: "rgb(var(--control-border))",
});

export const typographyTokens = stylex.defineVars({
  bodyFont: '"Schibsted Grotesk", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
  monospaceFont: '"JetBrains Mono", ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace',
});

export const layoutTokens = stylex.defineVars({
  // One narrow column on the left, as on shadcn.com.
  column: "26rem",
  // Long reads with tables and code get more room.
  articleColumn: "36rem",
  pageInset: "clamp(1.5rem, 6.5vw, 6rem)",
});

// The CV follows the site theme on screen. In print, appearance.css resets
// paper and ink to white and black.
export const cvColorTokens = stylex.defineVars({
  secondaryInk: "rgb(var(--ink) / 68%)",
  subtleRule: "rgb(var(--line))",
  screenCanvas: "rgb(var(--paper))",
  sheet: "rgb(var(--paper))",
});
