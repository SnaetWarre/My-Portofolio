import * as stylex from "@stylexjs/stylex";
import { colorTokens, layoutTokens, typographyTokens } from "./tokens.stylex";

const mobile = "@media (max-width: 700px)";

export const portfolioStyles = stylex.create({
  document: {
    colorScheme: "light",
  },
  body: {
    margin: 0,
    minWidth: 320,
    backgroundColor: colorTokens.background,
    color: colorTokens.foreground,
    fontFamily: typographyTokens.bodyFont,
    fontSize: "1rem",
    lineHeight: 1.6,
    textRendering: "optimizeLegibility",
  },
  mainContent: {
    width: {
      default: `min(${layoutTokens.portfolioMeasure}, calc(100% - ${layoutTokens.pageLeft} - ${layoutTokens.pageGutter}))`,
      [mobile]: "auto",
    },
    marginLeft: {
      default: layoutTokens.pageLeft,
      [mobile]: 0,
    },
    padding: {
      default: "4.5rem 0 4rem",
      [mobile]: `2.5rem ${layoutTokens.pageGutter} 3rem`,
    },
  },
  pageHeader: {
    marginBottom: "2rem",
  },
  primaryHeading: {
    margin: "0 0 0.5rem",
    fontSize: {
      default: "2.5rem",
      [mobile]: "2rem",
    },
    fontWeight: 500,
    letterSpacing: "-0.045em",
    lineHeight: 1.15,
  },
  navigation: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: "1.5rem",
    rowGap: 0,
  },
  navigationLink: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 44,
    minWidth: 44,
    color: {
      default: colorTokens.mutedForeground,
      ":hover": colorTokens.accent,
    },
    fontSize: "0.875rem",
    textDecorationLine: {
      default: "none",
      ":hover": "underline",
    },
  },
  introduction: {
    maxWidth: layoutTokens.contentMeasure,
  },
  lead: {
    margin: "0 0 1.25rem",
    fontSize: "1.125rem",
    lineHeight: 1.65,
    letterSpacing: "-0.012em",
  },
  paragraph: {
    margin: "0 0 1rem",
  },
  supportingText: {
    color: colorTokens.mutedForeground,
  },
  contactRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.5rem 1.5rem",
    marginTop: "1.5rem",
  },
  section: {
    display: "grid",
    gridTemplateColumns: {
      default: "7.5rem minmax(0, 1fr)",
      [mobile]: "minmax(0, 1fr)",
    },
    columnGap: "2.5rem",
    rowGap: "1rem",
    marginTop: layoutTokens.sectionGap,
    scrollMarginTop: "2rem",
  },
  sectionHeading: {
    margin: 0,
    paddingTop: "0.5rem",
    color: colorTokens.mutedForeground,
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.6,
    scrollMarginTop: "2rem",
  },
  link: {
    color: {
      default: colorTokens.accent,
      ":hover": colorTokens.accentHover,
    },
    textDecorationThickness: "1px",
    textDecorationColor: {
      default: colorTokens.border,
      ":hover": "currentColor",
    },
    textUnderlineOffset: "4px",
    outline: {
      default: null,
      ":focus-visible": `2px solid ${colorTokens.accent}`,
    },
    outlineOffset: {
      default: null,
      ":focus-visible": "4px",
    },
  },
  copyEmailButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    padding: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: "transparent",
    color: {
      default: colorTokens.accent,
      ":hover": colorTokens.accentHover,
      ":active": colorTokens.foreground,
    },
    fontFamily: "inherit",
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.5,
    cursor: "pointer",
    textDecorationLine: "underline",
    textDecorationThickness: {
      default: "1px",
      ":hover": "2px",
    },
    textUnderlineOffset: "4px",
    outline: {
      default: null,
      ":focus-visible": `2px solid ${colorTokens.accent}`,
    },
    outlineOffset: {
      default: null,
      ":focus-visible": "4px",
    },
  },
  projectList: {
    display: "grid",
    gap: "1.5rem",
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  projectRow: {
    minWidth: 0,
  },
  projectHeading: {
    margin: "0 0 0.25rem",
    fontSize: "1.0625rem",
    fontWeight: 500,
    letterSpacing: "-0.015em",
    lineHeight: 1.45,
  },
  primaryProjectLink: {
    display: "block",
    minHeight: 44,
    padding: "0.5rem 0",
    color: {
      default: colorTokens.foreground,
      ":hover": colorTokens.accent,
    },
    textDecorationLine: "underline",
  },
  projectDescription: {
    margin: 0,
    color: colorTokens.mutedForeground,
  },
  projectContext: {
    display: "block",
    color: colorTokens.mutedForeground,
    fontSize: "0.875rem",
    fontWeight: 400,
    letterSpacing: 0,
  },
  pageFooter: {
    marginTop: layoutTokens.sectionGap,
    paddingTop: "2rem",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colorTokens.borderLight,
    fontSize: "0.875rem",
    color: colorTokens.mutedForeground,
  },
  footerHeading: {
    margin: "0 0 0.75rem",
    color: colorTokens.foreground,
    fontSize: "1.125rem",
    fontWeight: 500,
    letterSpacing: "-0.015em",
  },
  footerMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: "0.5rem 1.5rem",
    marginTop: "2rem",
  },
  copyNotification: {
    position: "fixed",
    left: {
      default: layoutTokens.pageLeft,
      [mobile]: layoutTokens.pageGutter,
    },
    bottom: "1.5rem",
    zIndex: 20,
    maxWidth: `min(26rem, calc(100% - ${layoutTokens.pageGutter} * 2))`,
    backgroundColor: colorTokens.foreground,
    color: colorTokens.background,
    padding: "0.875rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 500,
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
    backgroundColor: colorTokens.foreground,
    color: colorTokens.background,
    padding: "0.75rem 1rem",
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
