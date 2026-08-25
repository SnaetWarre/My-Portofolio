import * as stylex from "@stylexjs/stylex";
import { colorTokens, layoutTokens, typographyTokens } from "./tokens.stylex";

const mobileBreakpoint = "@media (max-width: 700px)";

export const blogStyles = stylex.create({
  document: {
    scrollBehavior: "smooth",
  },
  pageColumn: {
    width: {
      default: `min(${layoutTokens.contentMeasure}, calc(100% - ${layoutTokens.pageLeft} - 2rem))`,
      [mobileBreakpoint]: "auto",
    },
    marginLeft: {
      default: layoutTokens.pageLeft,
      [mobileBreakpoint]: 0,
    },
    marginRight: {
      default: 0,
      [mobileBreakpoint]: 0,
    },
    paddingLeft: {
      default: 0,
      [mobileBreakpoint]: "1.25rem",
    },
    paddingRight: {
      default: 0,
      [mobileBreakpoint]: "1.25rem",
    },
  },
  image: {
    display: "block",
    maxWidth: "100%",
  },
  skipLink: {
    zIndex: 10,
  },
  siteNavigation: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingTop: {
      default: "4.5rem",
      [mobileBreakpoint]: "2rem",
    },
  },
  navigationLinks: {
    display: "flex",
    gap: "0.75rem",
  },
  blogPost: {
    paddingTop: {
      default: "2.25rem",
      [mobileBreakpoint]: "1.75rem",
    },
    paddingRight: 0,
    paddingBottom: {
      default: "5rem",
      [mobileBreakpoint]: "3.5rem",
    },
    paddingLeft: 0,
  },
  blogHeader: {
    marginBottom: "2rem",
  },
  metadata: {
    display: {
      default: "flex",
      [mobileBreakpoint]: "block",
    },
    flexWrap: "wrap",
    columnGap: "0.75rem",
    rowGap: "0.35rem",
    marginBottom: "0.9rem",
    color: colorTokens.mutedForeground,
    fontSize: "0.85rem",
  },
  metadataItem: {
    display: {
      default: "inline",
      [mobileBreakpoint]: "block",
    },
  },
  title: {
    maxWidth: "40rem",
    margin: 0,
    fontSize: {
      default: "clamp(2rem, 5vw, 3.5rem)",
      [mobileBreakpoint]: "clamp(1.9rem, 10vw, 2.75rem)",
    },
    lineHeight: 1.08,
    letterSpacing: "-0.025em",
  },
  articleContent: {
    maxWidth: layoutTokens.contentMeasure,
  },
  articleParagraph: {
    marginTop: 0,
    marginBottom: "1rem",
  },
  articleList: {
    marginTop: 0,
    marginBottom: "1rem",
    paddingLeft: "1.3rem",
  },
  articleListItem: {
    marginBottom: "0.45rem",
    paddingLeft: "0.1rem",
  },
  articleSectionHeading: {
    marginTop: "2.75rem",
    marginRight: 0,
    marginBottom: "0.8rem",
    marginLeft: 0,
    fontSize: "1.45rem",
    lineHeight: 1.25,
  },
  articleSubheading: {
    marginTop: "2rem",
    marginRight: 0,
    marginBottom: "0.65rem",
    marginLeft: 0,
    fontSize: "1.12rem",
    lineHeight: 1.3,
  },
  articleMinorHeading: {
    margin: 0,
    fontSize: "1rem",
    lineHeight: 1.35,
  },
  articleLink: {
    fontWeight: 600,
  },
  articleRule: {
    height: 1,
    marginTop: "3rem",
    marginRight: 0,
    marginBottom: "3rem",
    marginLeft: 0,
    borderWidth: 0,
    backgroundColor: colorTokens.borderLight,
  },
  statisticGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(4, 1fr)",
      [mobileBreakpoint]: "repeat(2, 1fr)",
    },
    marginTop: 0,
    marginRight: 0,
    marginBottom: "1.75rem",
    marginLeft: 0,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colorTokens.borderLight,
  },
  statisticItem: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    justifyContent: "center",
    padding: "1.15rem 0.75rem",
    borderRightWidth: {
      default: "1px",
      ":last-child": 0,
      [mobileBreakpoint]: {
        default: "1px",
        ":nth-child(2)": 0,
        ":last-child": 0,
      },
    },
    borderRightStyle: "solid",
    borderRightColor: colorTokens.borderLight,
    borderBottomWidth: {
      default: 0,
      [mobileBreakpoint]: {
        default: 0,
        ":nth-child(-n + 2)": "1px",
      },
    },
    borderBottomStyle: "solid",
    borderBottomColor: colorTokens.borderLight,
    textAlign: "center",
  },
  statisticNumber: {
    fontSize: "clamp(1.35rem, 3vw, 1.8rem)",
    fontWeight: 700,
    lineHeight: 1.2,
  },
  statisticLabel: {
    marginTop: "0.3rem",
    color: colorTokens.mutedForeground,
    fontSize: "0.72rem",
  },
  monospace: {
    fontFamily: typographyTokens.monospaceFont,
  },
  inlineCode: {
    padding: "0.08rem 0.25rem",
    backgroundColor: colorTokens.muted,
    fontSize: "0.86em",
  },
  codeBlock: {
    maxWidth: "100%",
    marginTop: "1.5rem",
    marginRight: 0,
    marginBottom: "1.5rem",
    marginLeft: 0,
    padding: "1rem",
    overflowX: "auto",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colorTokens.border,
    backgroundColor: colorTokens.foreground,
    color: colorTokens.background,
    fontSize: "0.78rem",
    lineHeight: 1.55,
  },
  codeInsideBlock: {
    padding: 0,
    backgroundColor: "transparent",
    color: "inherit",
    fontSize: "inherit",
  },
  table: {
    display: {
      default: "table",
      [mobileBreakpoint]: "block",
    },
    width: "100%",
    marginTop: "1.5rem",
    marginRight: 0,
    marginBottom: "1.5rem",
    marginLeft: 0,
    overflowX: {
      default: "visible",
      [mobileBreakpoint]: "auto",
    },
    borderCollapse: "collapse",
    whiteSpace: {
      default: "normal",
      [mobileBreakpoint]: "nowrap",
    },
    fontSize: "0.78rem",
  },
  tableCell: {
    padding: "0.7rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colorTokens.borderLight,
    textAlign: "left",
    verticalAlign: "top",
  },
  tableHeading: {
    borderColor: colorTokens.foreground,
    backgroundColor: colorTokens.foreground,
    color: colorTokens.background,
  },
  tableRow: {
    backgroundColor: {
      default: "transparent",
      ":hover": colorTokens.muted,
    },
  },
  imageWrapper: {
    marginTop: "2rem",
    marginRight: 0,
    marginBottom: "2rem",
    marginLeft: 0,
  },
  articleImage: {
    width: "100%",
    height: "auto",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: {
      default: colorTokens.borderLight,
      ":hover": colorTokens.foreground,
    },
  },
  imageCaption: {
    marginTop: "0.6rem",
    color: colorTokens.mutedForeground,
    fontSize: "0.7rem",
    lineHeight: 1.5,
  },
  pipeline: {
    display: "flex",
    alignItems: "stretch",
    flexDirection: {
      default: "row",
      [mobileBreakpoint]: "column",
    },
    marginTop: "1.5rem",
    marginRight: 0,
    marginBottom: "1.5rem",
    marginLeft: 0,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colorTokens.foreground,
    fontSize: "0.7rem",
  },
  pipelineStep: {
    display: "flex",
    minWidth: 0,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: {
      default: "0.75rem 0.55rem",
      [mobileBreakpoint]: "0.85rem",
    },
    borderBottomWidth: {
      default: 0,
      [mobileBreakpoint]: {
        default: "1px",
        ":last-child": 0,
      },
    },
    borderBottomStyle: "solid",
    borderBottomColor: colorTokens.borderLight,
    textAlign: "center",
  },
  pipelineArrow: {
    display: {
      default: "block",
      [mobileBreakpoint]: "none",
    },
    alignSelf: "center",
    color: colorTokens.mutedForeground,
  },
  pipelineLabel: {
    fontWeight: 700,
  },
  pipelineDetail: {
    marginTop: "0.2rem",
    color: colorTokens.mutedForeground,
  },
  methodsGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(2, 1fr)",
      [mobileBreakpoint]: "1fr",
    },
    marginTop: "1.5rem",
    marginRight: 0,
    marginBottom: "1.5rem",
    marginLeft: 0,
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colorTokens.borderLight,
    borderLeftWidth: "1px",
    borderLeftStyle: "solid",
    borderLeftColor: colorTokens.borderLight,
  },
  methodCard: {
    padding: "1rem",
    borderRightWidth: "1px",
    borderRightStyle: "solid",
    borderRightColor: colorTokens.borderLight,
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: colorTokens.borderLight,
  },
  methodDescription: {
    marginTop: "0.4rem",
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: colorTokens.mutedForeground,
    fontFamily: typographyTokens.bodyFont,
    fontSize: "0.9rem",
  },
  articleFooterMetadata: {
    marginTop: "2.5rem",
    color: colorTokens.mutedForeground,
    fontSize: "0.88rem",
  },
  nextSteps: {
    marginTop: "3rem",
    paddingTop: "1.25rem",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colorTokens.borderLight,
  },
  nextStepLink: {
    display: "inline-flex",
    flexWrap: "wrap",
    columnGap: "0.3rem",
    rowGap: "0.3rem",
    alignItems: "baseline",
  },
  nextStepLabel: {
    color: colorTokens.mutedForeground,
  },
  footer: {
    marginBottom: "4rem",
    color: colorTokens.mutedForeground,
    fontSize: "0.92rem",
  },
  footerContent: {
    display: "flex",
    alignItems: {
      default: "center",
      [mobileBreakpoint]: "flex-start",
    },
    justifyContent: "space-between",
    gap: "1rem",
    flexDirection: {
      default: "row",
      [mobileBreakpoint]: "column",
    },
  },
  footerBrand: {
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
  },
  footerBrandParagraph: {
    margin: 0,
  },
  footerLogo: {
    width: "2rem",
    height: "2rem",
  },
  footerCallToAction: {
    color: colorTokens.foreground,
  },
});
