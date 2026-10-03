import * as stylex from "@stylexjs/stylex";
import { colorTokens } from "./tokens.stylex";

export const obsidianTheme = stylex.createTheme(colorTokens, {
  background: "rgb(var(--obsidian-paper))",
  foreground: "rgb(var(--obsidian-ink))",
  muted: "rgb(var(--obsidian-ink) / 5%)",
  mutedForeground: "rgb(var(--obsidian-ink) / 67%)",
  border: "rgb(var(--obsidian-ink) / 28%)",
  borderLight: "rgb(var(--obsidian-ink) / 15%)",
  accent: "rgb(var(--obsidian-ink))",
  accentHover: "rgb(var(--obsidian-ink) / 80%)",
});

export const obsidianStyles = stylex.create({
  content: {
    position: "relative",
    zIndex: 1,
    marginLeft: { default: "7vw", "@media (max-width: 700px)": 0 },
    width: { default: "min(44rem, 49vw)", "@media (max-width: 700px)": "auto" },
    paddingTop: { default: "12vh", "@media (max-width: 700px)": "1.5rem" },
  },
  article: {
    position: "relative",
    zIndex: 1,
    marginLeft: { default: "7vw", "@media (max-width: 700px)": 0 },
    width: { default: "min(43rem, 49vw)", "@media (max-width: 700px)": "auto" },
    paddingTop: { default: "6rem", "@media (max-width: 700px)": "1.5rem" },
  },
  controlsHost: {
    // Fixed beside the sculpture on wide screens. On phones the control would
    // cover the reading column, so it sits in the first row and scrolls away.
    position: { default: "fixed", "@media (max-width: 700px)": "absolute" },
    top: { default: "1rem", "@media (max-width: 700px)": "calc(1.5rem - 1px)" },
    right: "1.5rem",
    zIndex: 3,
  },
  themeControls: {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    padding: { default: "0.25rem", "@media (max-width: 700px)": 0 },
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colorTokens.borderLight,
    backgroundColor: "rgb(var(--obsidian-paper) / 92%)",
  },
  hero: {
    minHeight: { default: "76vh", "@media (max-width: 700px)": "auto" },
  },
  // Keeps the first row of a page clear of the theme control on phones.
  besideControls: {
    paddingRight: { default: null, "@media (max-width: 700px)": "3.75rem" },
  },
  heading: {
    fontSize: { default: "clamp(3rem, 5.2vw, 6rem)", "@media (max-width: 700px)": "clamp(2.5rem, 10vw, 4rem)" },
    fontWeight: 450,
    letterSpacing: "-0.065em",
    marginBottom: "1.2rem",
  },
  scene: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    overflow: "hidden",
    display: { default: "block", "@media (max-width: 700px)": "none" },
  },
  canvas: { display: "block", width: "100%", height: "100%" },
  veil: {
    position: "absolute",
    inset: 0,
    backgroundImage: {
      // Solid under the text column, then clear before the sculpture begins.
      default: "linear-gradient(90deg, rgb(var(--obsidian-paper)) 0%, rgb(var(--obsidian-paper) / 96%) 52%, rgb(var(--obsidian-paper) / 35%) 58%, transparent 64%)",
      "@media (max-width: 700px)": "linear-gradient(180deg, rgb(var(--obsidian-paper) / 84%), rgb(var(--obsidian-paper) / 88%) 55%, rgb(var(--obsidian-paper) / 82%))",
    },
  },
  // Says what the sculpture is showing on this page.
  caption: {
    position: "absolute",
    right: "1.5rem",
    bottom: "1.5rem",
    maxWidth: "15rem",
    margin: 0,
    padding: "0.4rem 0.6rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colorTokens.borderLight,
    backgroundColor: "rgb(var(--obsidian-paper) / 92%)",
    color: colorTokens.mutedForeground,
    fontSize: "0.8125rem",
    lineHeight: 1.45,
    textAlign: "right",
    textWrap: "balance",
  },
  iconButton: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    verticalAlign: "middle",
    width: { default: 34, "@media (max-width: 700px)": 44 },
    height: { default: 34, "@media (max-width: 700px)": 44 },
    padding: 0,
    borderWidth: 0,
    appearance: "none",
    borderRadius: 0,
    backgroundColor: { default: "transparent", ":hover": colorTokens.muted },
    color: { default: colorTokens.mutedForeground, ":hover": colorTokens.foreground },
    cursor: "pointer",
    outline: { default: null, ":focus-visible": `2px solid ${colorTokens.foreground}` },
    outlineOffset: 2,
  },
});
