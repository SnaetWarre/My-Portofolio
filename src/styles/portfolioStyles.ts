import * as stylex from "@stylexjs/stylex";
import { colorTokens, layoutTokens, typographyTokens } from "./tokens.stylex";

const focusRing = {
  outline: {
    default: null,
    ":focus-visible": `2px solid ${colorTokens.foreground}`,
  },
  outlineOffset: {
    default: null,
    ":focus-visible": "2px",
  },
} as const;

// Only links are underlined. Headings never are, so nothing looks clickable
// that isn't.
const underline = {
  textDecorationLine: "underline",
  textDecorationThickness: "1px",
  textDecorationColor: {
    default: "color-mix(in srgb, currentColor 45%, transparent)",
    ":hover": "currentColor",
  },
  textUnderlineOffset: "4px",
} as const;

export const portfolioStyles = stylex.create({
  document: {},
  body: {
    margin: 0,
    minWidth: 320,
    backgroundColor: colorTokens.background,
    color: colorTokens.foreground,
    fontFamily: typographyTokens.bodyFont,
    fontSize: "0.875rem",
    lineHeight: 1.43,
    textRendering: "optimizeLegibility",
    WebkitFontSmoothing: "antialiased",
    textWrap: "pretty",
  },
  page: {
    padding: `${layoutTokens.pageInset} ${layoutTokens.pageInset} 6rem`,
  },
  column: {
    maxWidth: layoutTokens.column,
  },

  // The first row of every page: a trail of links, and the theme button.
  topline: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: "0.5rem 1rem",
  },
  trail: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  trailSeparator: {
    padding: "0 0.6rem",
    color: colorTokens.mutedForeground,
  },
  trailCurrent: {
    color: colorTokens.mutedForeground,
  },
  link: {
    color: {
      default: colorTokens.text,
      ":hover": colorTokens.foreground,
    },
    ...underline,
    ...focusRing,
  },
  textButton: {
    padding: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: "transparent",
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    cursor: "pointer",
  },
  // Square grey buttons, as on shadcn.com.
  button: {
    display: "inline-flex",
    alignItems: "center",
    height: "1.75rem",
    padding: "0 0.5rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: colorTokens.controlBorder,
      ":hover": colorTokens.foreground,
    },
    borderRadius: 0,
    backgroundColor: {
      default: colorTokens.control,
      ":active": colorTokens.muted,
    },
    color: colorTokens.foreground,
    fontFamily: "inherit",
    fontSize: "0.875rem",
    lineHeight: 1,
    textDecorationLine: "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
    ...focusRing,
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "1.25rem",
  },

  // Intro: a few short lines, then the longer paragraph.
  intro: {
    marginTop: "3.75rem",
  },
  introLine: {
    margin: 0,
    lineHeight: "1.75rem",
  },
  // The first line doubles as the page heading, in the same size as the rest.
  introHeading: {
    fontSize: "inherit",
    fontWeight: "inherit",
  },
  paragraph: {
    margin: "1rem 0 0",
    color: colorTokens.text,
    lineHeight: 1.625,
  },

  section: {
    marginTop: "4.5rem",
  },
  sectionHeading: {
    margin: "0 0 0.75rem",
    fontSize: "1rem",
    fontWeight: 500,
    lineHeight: "1.5rem",
    scrollMarginTop: "1.5rem",
  },

  projectList: {
    display: "grid",
    gap: "1.75rem",
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  rowHeading: {
    margin: 0,
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: "1.25rem",
  },
  rowLink: {
    color: colorTokens.foreground,
    ...underline,
    ...focusRing,
  },
  rowRole: {
    margin: "0.125rem 0 0",
    color: colorTokens.mutedForeground,
  },
  rowText: {
    margin: "0.5rem 0 0",
    color: colorTokens.text,
    lineHeight: 1.625,
  },

  footnote: {
    marginTop: "4.5rem",
    color: colorTokens.mutedForeground,
  },

  // End of a project page: what to read next.
  pageEnd: {
    marginTop: "4.5rem",
  },
  pageEndLabel: {
    margin: "0 0 0.25rem",
    color: colorTokens.mutedForeground,
  },
  pageEndNext: {
    margin: "0 0 1.25rem",
    fontWeight: 500,
  },

  copyNotification: {
    position: "fixed",
    left: layoutTokens.pageInset,
    bottom: "1.5rem",
    zIndex: 20,
    maxWidth: `min(${layoutTokens.column}, calc(100% - 3rem))`,
    padding: "0.5rem 0.75rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colorTokens.border,
    backgroundColor: colorTokens.background,
    color: colorTokens.foreground,
    overflowWrap: "anywhere",
  },
  skipLink: {
    position: "fixed",
    zIndex: 30,
    top: "0.75rem",
    left: "0.75rem",
    transform: {
      default: "translateY(-200%)",
      ":focus": "none",
    },
    padding: "0.5rem 0.75rem",
    backgroundColor: colorTokens.foreground,
    color: colorTokens.background,
  },
  visuallyHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
  },
});
