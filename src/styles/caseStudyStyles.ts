import * as stylex from "@stylexjs/stylex";
import { colorTokens, layoutTokens } from "./tokens.stylex";

const phone = "@media (max-width: 700px)";
const narrow = "@media (max-width: 860px)";

export const caseStudyStyles = stylex.create({
  // The project's drawing, shown large beside the title block.
  drawing: {
    width: { default: "calc(100% - 27rem)", [narrow]: "100%" },
    maxWidth: { default: "36rem", [narrow]: "24rem" },
    padding: { default: "1.5rem 0 0.5rem", [narrow]: "1.25rem 0 0" },
  },
  mainContent: {
    maxWidth: layoutTokens.contentMeasure,
    padding: "2rem 0 0",
  },
  navigation: {},
  header: {},
  metadataLabel: {
    color: colorTokens.mutedForeground,
    fontSize: "0.8125rem",
    fontWeight: 500,
  },
  kicker: {},
  heading: {
    margin: "0 0 0.75rem",
    fontSize: "2rem",
    fontWeight: 300,
    lineHeight: 1.2,
  },
  lead: {
    margin: "0 0 1rem",
    fontSize: "1.1875rem",
    fontWeight: 300,
    lineHeight: 1.5,
  },
  metadataList: { margin: 0 },
  metadataRow: {},
  metadataTerm: {},
  metadataDescription: {},

  // Sections read like notes in a drawing's margin: a short label on the
  // left, the text on the right. They stack on narrow screens.
  section: {
    display: "grid",
    gridTemplateColumns: { default: "7.5rem minmax(0, 1fr)", [phone]: "minmax(0, 1fr)" },
    columnGap: "1.5rem",
    marginTop: "1.75rem",
    paddingTop: "1.25rem",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colorTokens.borderLight,
  },
  sectionLabel: {
    margin: { default: "0.15rem 0 0", [phone]: "0 0 0.35rem" },
  },
  sectionHeading: {
    margin: "0 0 0.6rem",
    fontSize: "1.1875rem",
    fontWeight: 400,
    lineHeight: 1.3,
  },
  paragraph: {
    margin: {
      default: "0 0 0.875rem",
      ":last-child": 0,
    },
    color: colorTokens.mutedForeground,
  },
  subheading: {
    margin: "1.25rem 0 0.4rem",
    fontSize: "1rem",
    fontWeight: 500,
  },
  list: {
    margin: {
      default: "0 0 0.875rem",
      ":last-child": 0,
    },
    paddingLeft: "1.1rem",
    color: colorTokens.mutedForeground,
  },
  listItem: {
    marginBottom: "0.5rem",
  },
  factsList: {
    marginTop: "0.75rem",
    marginBottom: 0,
  },
  emphasizedFact: {
    color: colorTokens.foreground,
    fontWeight: 500,
    "::after": {
      content: '": "',
    },
  },
  architecture: {
    marginTop: "0.75rem",
  },
  // One tier of a text diagram. Nodes sit side by side when the column
  // allows it; otherwise they stack.
  flowRow: {
    display: {
      default: "contents",
      "@media (min-width: 1100px)": "grid",
    },
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    columnGap: "1rem",
  },
  flowNode: {
    marginBottom: "0.65rem",
    padding: "0.5rem 0.75rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colorTokens.border,
    fontSize: "0.9375rem",
  },
  flowNodeContent: {
    display: "block",
    color: colorTokens.foreground,
    fontWeight: 400,
  },
  flowNodeDescription: {
    display: "block",
    color: colorTokens.mutedForeground,
    fontSize: "0.875rem",
  },
  flowArrow: {
    margin: "0 0 0.65rem",
    color: colorTokens.mutedForeground,
    fontSize: "0.8125rem",
  },
  figure: {
    margin: "1rem 0 0",
  },
  figureImage: {
    display: "block",
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colorTokens.borderLight,
  },
  figureCaption: {
    marginTop: "0.5rem",
    color: colorTokens.mutedForeground,
    fontSize: "0.8125rem",
  },
  links: {
    marginTop: "0.75rem",
  },
  importantLink: {
    fontWeight: 500,
  },
});
