import * as stylex from "@stylexjs/stylex";
import { colorTokens, layoutTokens, typographyTokens } from "./tokens.stylex";

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
    fontSize: {
      default: "1.08rem",
      "@media (max-width: 700px)": "1rem",
    },
    lineHeight: 1.55,
    textRendering: "optimizeLegibility",
  },
  mainContent: {
    width: {
      default: `min(${layoutTokens.contentMeasure}, calc(100% - ${layoutTokens.pageLeft} - 2rem))`,
      "@media (max-width: 700px)": "auto",
    },
    marginLeft: {
      default: layoutTokens.pageLeft,
      "@media (max-width: 700px)": 0,
    },
    padding: {
      default: "4.5rem 0 6rem",
      "@media (max-width: 700px)": "2rem 1.25rem 4rem",
    },
  },
  pageHeader: {
    marginBottom: "2.25rem",
  },
  primaryHeading: {
    marginTop: 0,
    marginBottom: "1rem",
    fontSize: "1.85rem",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    lineHeight: 1.2,
  },
  sectionHeading: {
    marginTop: "2.25rem",
    marginRight: 0,
    marginBottom: "0.75rem",
    marginLeft: 0,
    fontSize: "1.3rem",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    lineHeight: 1.3,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: "1rem",
  },
  navigation: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: "0.5rem",
    rowGap: "0.25rem",
  },
  link: {
    color: "inherit",
    textDecorationThickness: {
      default: "1px",
      ":hover": "2px",
    },
    textUnderlineOffset: "2px",
    outline: {
      default: null,
      ":focus-visible": "2px solid currentColor",
    },
    outlineOffset: {
      default: null,
      ":focus-visible": "3px",
    },
  },
  copyEmailButton: {
    borderWidth: 0,
    backgroundColor: "transparent",
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontStyle: "inherit",
    fontVariant: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    padding: 0,
    cursor: "pointer",
    textDecorationLine: "underline",
    textDecorationThickness: {
      default: "1px",
      ":hover": "2px",
    },
    textUnderlineOffset: "2px",
    outline: {
      default: null,
      ":focus-visible": "2px solid currentColor",
    },
    outlineOffset: {
      default: null,
      ":focus-visible": "3px",
    },
  },
  list: {
    marginTop: 0,
    paddingLeft: "1.2rem",
  },
  listItem: {
    marginBottom: "0.65rem",
    paddingLeft: "0.15rem",
  },
  projectRow: {
    position: "relative",
    marginTop: 0,
    marginRight: 0,
    marginBottom: "0.25rem",
    marginLeft: 0,
    padding: "0.55rem 0.5rem 0.55rem 0.15rem",
    backgroundColor: {
      default: "transparent",
      ":hover": colorTokens.muted,
    },
  },
  staticProjectRow: {
    backgroundColor: {
      default: null,
      ":hover": "transparent",
    },
  },
  primaryProjectLink: {
    fontWeight: 600,
    "::after": {
      content: '""',
      position: "absolute",
      inset: 0,
    },
  },
  projectDescription: {
    color: colorTokens.mutedForeground,
  },
  secondaryProjectLink: {
    position: "relative",
    zIndex: 1,
    color: colorTokens.foreground,
  },
  pageFooter: {
    marginTop: "3rem",
    color: colorTokens.mutedForeground,
    fontSize: "0.92rem",
  },
  copyNotification: {
    position: "fixed",
    left: {
      default: layoutTokens.pageLeft,
      "@media (max-width: 700px)": "1.25rem",
    },
    bottom: "1.25rem",
    zIndex: 20,
    maxWidth: "min(24rem, calc(100% - 2.5rem))",
    borderRadius: "0.375rem",
    backgroundColor: colorTokens.foreground,
    color: colorTokens.background,
    padding: "0.7rem 0.9rem",
    fontSize: "0.88rem",
    fontWeight: 500,
  },
  skipLink: {
    position: "fixed",
    top: "0.75rem",
    left: "0.75rem",
    transform: {
      default: "translateY(-200%)",
      ":focus": "none",
    },
    backgroundColor: colorTokens.foreground,
    color: colorTokens.background,
    padding: "0.5rem 0.75rem",
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
