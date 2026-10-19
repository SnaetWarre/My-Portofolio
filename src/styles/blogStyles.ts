import * as stylex from "@stylexjs/stylex";
import { colorTokens, typographyTokens } from "./tokens.stylex";

const hairline = {
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: colorTokens.border,
} as const;

export const blogStyles = stylex.create({
  document: {
    scrollBehavior: {
      default: "smooth",
      "@media (prefers-reduced-motion: reduce)": "auto",
    },
  },
  image: {
    display: "block",
    maxWidth: "100%",
  },
  skipLink: {
    zIndex: 10,
  },
  blogHeader: {
    marginTop: "3.75rem",
    marginBottom: "2rem",
  },
  metadata: {
    display: "flex",
    flexDirection: "column",
    marginTop: "0.25rem",
    color: colorTokens.mutedForeground,
  },
  title: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 500,
    letterSpacing: "-0.01em",
    lineHeight: "1.75rem",
    textWrap: "balance",
  },
  contents: {
    marginTop: "2.5rem",
  },
  contentsHeading: {
    margin: "0 0 0.5rem",
    fontSize: "1rem",
    fontWeight: 500,
    lineHeight: "1.5rem",
  },
  contentsList: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    lineHeight: "1.625rem",
  },
  contentsLink: {},
  articleContent: {},
  articleParagraph: {
    marginTop: 0,
    marginBottom: "0.875rem",
    color: colorTokens.text,
    lineHeight: 1.625,
  },
  articleList: {
    marginTop: 0,
    marginBottom: "0.875rem",
    paddingLeft: "1.1rem",
    color: colorTokens.text,
    lineHeight: 1.625,
  },
  articleListItem: {
    marginBottom: "0.375rem",
  },
  articleSectionHeading: {
    margin: "3rem 0 0.75rem",
    fontSize: "1rem",
    fontWeight: 500,
    lineHeight: "1.5rem",
    scrollMarginTop: "1.5rem",
  },
  articleSubheading: {
    margin: "1.75rem 0 0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: "1.25rem",
  },
  articleMinorHeading: {
    margin: 0,
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: "1.25rem",
  },
  articleLink: {},
  // The key figures read like the numbers on the home page: label on the
  // left, value on the right. The markup puts the value first.
  statisticGrid: {
    margin: "0 0 2rem",
  },
  statisticItem: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "1rem",
    lineHeight: "1.5625rem",
  },
  statisticNumber: {
    fontFamily: typographyTokens.monospaceFont,
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  statisticLabel: {
    color: colorTokens.text,
  },
  monospace: {
    fontFamily: typographyTokens.monospaceFont,
  },
  inlineCode: {
    padding: "0.0625rem 0.25rem",
    backgroundColor: colorTokens.muted,
    fontSize: "0.85em",
  },
  codeBlock: {
    maxWidth: "100%",
    margin: "1.25rem 0",
    padding: "0.75rem",
    overflowX: "auto",
    ...hairline,
    backgroundColor: colorTokens.muted,
    color: colorTokens.foreground,
    fontSize: "0.75rem",
    lineHeight: 1.6,
  },
  codeInsideBlock: {
    padding: 0,
    backgroundColor: "transparent",
    color: "inherit",
    fontSize: "inherit",
  },
  // Tables keep their columns and scroll sideways in the narrow column.
  table: {
    display: "block",
    maxWidth: "100%",
    margin: "1.25rem 0",
    overflowX: "auto",
    borderCollapse: "collapse",
    whiteSpace: "nowrap",
    fontSize: "0.75rem",
  },
  tableCell: {
    padding: "0.375rem 0.625rem",
    ...hairline,
    textAlign: "left",
    verticalAlign: "top",
  },
  tableHeading: {
    backgroundColor: colorTokens.muted,
    fontWeight: 500,
  },
  tableRow: {},
  imageWrapper: {
    margin: "1.5rem 0",
  },
  articleImage: {
    width: "100%",
    height: "auto",
    ...hairline,
  },
  imageCaption: {
    marginTop: "0.5rem",
    color: colorTokens.mutedForeground,
    fontSize: "0.75rem",
    lineHeight: 1.5,
  },
  // Pipeline steps stack like the flow boxes on the project pages.
  pipeline: {
    margin: "1.25rem 0",
  },
  pipelineStep: {
    marginBottom: "0.5rem",
    padding: "0.5rem 0.75rem",
    ...hairline,
  },
  pipelineLabel: {
    display: "block",
    fontWeight: 500,
  },
  pipelineDetail: {
    display: "block",
    marginTop: "0.125rem",
    color: colorTokens.text,
  },
  methodsGrid: {
    margin: "1.25rem 0",
  },
  methodCard: {
    marginBottom: "0.5rem",
    padding: "0.5rem 0.75rem",
    ...hairline,
  },
  methodDescription: {
    margin: "0.125rem 0 0",
    color: colorTokens.text,
    fontFamily: typographyTokens.bodyFont,
    lineHeight: 1.5,
  },
  articleFooterMetadata: {
    marginTop: "2rem",
    color: colorTokens.mutedForeground,
  },
});
