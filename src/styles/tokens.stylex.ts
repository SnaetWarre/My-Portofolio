import * as stylex from "@stylexjs/stylex";

export const colorTokens = stylex.defineVars({
  background: "#ffffff",
  foreground: "#000000",
  muted: "rgb(0 0 0 / 5%)",
  mutedForeground: "rgb(0 0 0 / 64%)",
  border: "rgb(0 0 0 / 18%)",
  borderLight: "rgb(0 0 0 / 10%)",
});

export const typographyTokens = stylex.defineVars({
  bodyFont: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  monospaceFont: 'ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace',
});

export const layoutTokens = stylex.defineVars({
  contentMeasure: "43rem",
  pageLeft: "clamp(1.25rem, 11vw, 13rem)",
});
