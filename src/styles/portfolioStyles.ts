import * as stylex from "@stylexjs/stylex";
import { colorTokens, layoutTokens, typographyTokens } from "./tokens.stylex";

const phone = "@media (max-width: 700px)";
// Below this width a drawing no longer fits beside its text.
const narrow = "@media (max-width: 860px)";

const underline = {
  textDecorationLine: "underline",
  textDecorationThickness: "1px",
  textDecorationColor: {
    default: colorTokens.border,
    ":hover": "currentColor",
  },
  textUnderlineOffset: "4px",
} as const;

const focusRing = {
  outline: {
    default: null,
    ":focus-visible": `2px solid ${colorTokens.foreground}`,
  },
  outlineOffset: {
    default: null,
    ":focus-visible": "3px",
  },
} as const;

export const portfolioStyles = stylex.create({
  document: {},
  body: {
    margin: 0,
    minWidth: 320,
    backgroundColor: colorTokens.background,
    color: colorTokens.foreground,
    fontFamily: typographyTokens.bodyFont,
    fontSize: "1rem",
    lineHeight: 1.55,
    textRendering: "optimizeLegibility",
    WebkitFontSmoothing: "antialiased",
    textWrap: "pretty",
  },
  page: {
    maxWidth: layoutTokens.pageWidth,
    margin: "0 auto",
    padding: `0 ${layoutTokens.pageGutter} 3rem`,
  },

  // The first row of every page: name on the left, links on the right.
  topline: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: "0 1rem",
    paddingTop: "0.75rem",
    fontSize: "0.875rem",
    color: colorTokens.mutedForeground,
  },
  navigation: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: "1.1rem",
  },
  navigationLink: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 44,
    color: {
      default: colorTokens.mutedForeground,
      ":hover": colorTokens.foreground,
    },
    fontSize: "0.875rem",
    textDecorationLine: {
      default: "none",
      ":hover": "underline",
    },
    textDecorationThickness: "1px",
    textUnderlineOffset: "4px",
    ...focusRing,
  },
  textButton: {
    padding: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: "transparent",
    fontFamily: "inherit",
    cursor: "pointer",
  },

  // Cover: the title block drawn as a strip across the page.
  cover: {
    marginTop: "1.25rem",
  },
  titleBlock: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1fr) auto", [narrow]: "minmax(0, 1fr)" },
    fontSize: "0.8125rem",
  },
  titleBlockName: {
    padding: { default: "0.75rem 1.25rem 0.75rem 0", [narrow]: "0.75rem 0 0.625rem" },
  },
  titleBlockHeading: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: 300,
    letterSpacing: "-0.01em",
    lineHeight: 1.15,
    textWrap: "balance",
  },
  titleBlockTag: {
    margin: "0.25rem 0 0",
    color: colorTokens.mutedForeground,
    textWrap: "pretty",
  },
  titleBlockCells: {
    display: "grid",
    gridAutoFlow: { default: "column", [narrow]: "row" },
    gridAutoColumns: "minmax(8.5rem, auto)",
    gridTemplateColumns: { default: "none", [narrow]: "repeat(auto-fit, minmax(6.5rem, 1fr))" },
  },
  titleBlockCell: {
    padding: "0.45rem 0.875rem 0.55rem",
    paddingLeft: { default: null, [narrow]: { default: null, ":first-child": 0 } },
    paddingRight: { default: null, ":last-child": 0 },
    lineHeight: 1.35,
    overflowWrap: "anywhere",
  },
  titleBlockLabel: {
    display: "block",
    color: colorTokens.mutedForeground,
    fontSize: "0.75rem",
  },

  // Intro under the cover.
  intro: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 60ch) 1fr", [narrow]: "minmax(0, 1fr)" },
    gap: "1.5rem 2.5rem",
    padding: "2.5rem 0 2.75rem",
  },
  lead: {
    margin: "0 0 0.875rem",
    fontSize: "1.1875rem",
    fontWeight: 300,
    lineHeight: 1.5,
  },
  paragraph: {
    margin: "0 0 0.875rem",
  },
  supportingText: {
    color: colorTokens.mutedForeground,
  },
  contactColumn: {
    alignSelf: "end",
    justifySelf: { default: "end", [narrow]: "start" },
    display: "flex",
    flexDirection: "column",
    alignItems: { default: "flex-end", [narrow]: "flex-start" },
    gap: "0.25rem",
    fontSize: "0.875rem",
  },
  contactRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.25rem 1.25rem",
    marginTop: "0.5rem",
  },
  copyEmailButton: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 44,
    padding: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: "transparent",
    color: {
      default: colorTokens.foreground,
      ":active": colorTokens.mutedForeground,
    },
    fontFamily: "inherit",
    fontSize: "0.875rem",
    lineHeight: 1.5,
    cursor: "pointer",
    ...underline,
    ...focusRing,
  },

  // Lists of work.
  sectionHeading: {
    margin: 0,
    padding: "2.5rem 0 0.4rem",
    color: colorTokens.mutedForeground,
    fontSize: "0.875rem",
    fontWeight: 500,
    scrollMarginTop: "1.5rem",
  },
  projectList: {
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  row: {
    padding: "1.35rem 0 1.5rem",
  },
  rowAside: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1fr) 18.75rem", [narrow]: "minmax(0, 1fr)" },
    gap: "0.75rem 3rem",
    alignItems: "start",
  },
  rowHeading: {
    margin: 0,
    fontSize: "1.1875rem",
    fontWeight: 400,
    lineHeight: 1.3,
    letterSpacing: "-0.005em",
  },
  rowLink: {
    color: colorTokens.foreground,
    textDecorationLine: {
      default: "none",
      ":hover": "underline",
    },
    textDecorationThickness: "1px",
    textUnderlineOffset: "4px",
    ...focusRing,
  },
  rowRole: {
    display: { default: "inline", [phone]: "block" },
    marginLeft: { default: "0.75rem", [phone]: 0 },
    marginTop: { default: 0, [phone]: "0.15rem" },
    color: colorTokens.mutedForeground,
    fontSize: "0.875rem",
    fontWeight: 400,
    letterSpacing: 0,
  },
  rowText: {
    margin: "0.4rem 0 0",
    maxWidth: "62ch",
    color: colorTokens.mutedForeground,
  },
  drawingAside: {
    maxWidth: { default: null, [narrow]: "20rem" },
    marginTop: { default: "0.25rem", [narrow]: "0.75rem" },
  },
  drawingBelow: {
    maxWidth: "51rem",
    margin: "1.4rem 0 0.25rem",
  },

  // Page footer with the email.
  pageFooter: {
    display: "grid",
    gridTemplateColumns: { default: "1fr 1fr", [narrow]: "1fr" },
    marginTop: "3rem",
    fontSize: "0.875rem",
    color: colorTokens.mutedForeground,
  },
  footerColumn: {
    paddingTop: "1.1rem",
  },
  footerAside: {
    paddingTop: "1.1rem",
    paddingLeft: { default: "1.5rem", [narrow]: 0 },
    textAlign: { default: "right", [narrow]: "left" },
  },
  footerHeading: {
    margin: "0 0 0.4rem",
    color: colorTokens.mutedForeground,
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  emailLink: {
    display: "inline-block",
    marginTop: "0.4rem",
    color: colorTokens.foreground,
    fontSize: "1.125rem",
  },

  // End of a project page: what to read next.
  pageEnd: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "0.5rem 2rem",
    marginTop: layoutTokens.sectionGap,
    paddingTop: "1.25rem",
  },
  pageEndNext: {
    margin: 0,
    fontSize: "1.1875rem",
    fontWeight: 400,
    lineHeight: 1.3,
  },
  pageEndLabel: {
    display: "block",
    color: colorTokens.mutedForeground,
    fontSize: "0.875rem",
  },

  // Shared
  link: {
    color: {
      default: colorTokens.foreground,
      ":hover": colorTokens.foreground,
    },
    ...underline,
    ...focusRing,
  },
  copyNotification: {
    position: "fixed",
    left: layoutTokens.pageGutter,
    bottom: "1.25rem",
    zIndex: 20,
    maxWidth: `min(26rem, calc(100% - ${layoutTokens.pageGutter} * 2))`,
    padding: "0.75rem 0.875rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colorTokens.border,
    backgroundColor: colorTokens.background,
    color: colorTokens.foreground,
    fontSize: "0.875rem",
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
    padding: "0.75rem 1rem",
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
