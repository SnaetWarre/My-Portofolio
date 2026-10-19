import * as stylex from "@stylexjs/stylex";
import { colorTokens, typographyTokens } from "./tokens.stylex";

export const caseStudyStyles = stylex.create({
  heading: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 500,
    letterSpacing: "-0.01em",
    lineHeight: "1.75rem",
    textWrap: "balance",
  },
  kicker: {
    margin: "0.25rem 0 0",
    color: colorTokens.mutedForeground,
  },
  // Role, stack and setting: label on the left, value on the right.
  facts: {
    margin: "1.5rem 0 0",
  },
  factRow: {
    display: "grid",
    gridTemplateColumns: "5.5rem minmax(0, 1fr)",
    gap: "1rem",
    padding: "0.125rem 0",
    lineHeight: "1.375rem",
  },
  factLabel: {
    color: colorTokens.mutedForeground,
  },
  factValue: {
    margin: 0,
    color: colorTokens.text,
  },
  lead: {
    margin: "2.5rem 0 0",
    lineHeight: "1.75rem",
  },

  section: {
    marginTop: "3rem",
  },
  sectionLabel: {
    margin: 0,
    color: colorTokens.mutedForeground,
  },
  sectionHeading: {
    margin: "0.125rem 0 0.75rem",
    fontSize: "1rem",
    fontWeight: 500,
    lineHeight: "1.5rem",
  },
  // Small label inside a flow node.
  metadataLabel: {
    color: colorTokens.mutedForeground,
    fontSize: "0.75rem",
    fontWeight: 400,
  },
  paragraph: {
    margin: {
      default: "0 0 0.875rem",
      ":last-child": 0,
    },
    color: colorTokens.text,
    lineHeight: 1.625,
  },
  list: {
    margin: {
      default: "0 0 0.875rem",
      ":last-child": 0,
    },
    paddingLeft: "1.1rem",
    color: colorTokens.text,
    lineHeight: 1.625,
  },
  listItem: {
    marginBottom: "0.375rem",
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

  // A text diagram: boxes stacked top to bottom, arrows between tiers.
  architecture: {
    marginTop: "0.75rem",
  },
  flowRow: {},
  flowNode: {
    marginBottom: "0.5rem",
    padding: "0.5rem 0.75rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colorTokens.border,
  },
  flowNodeContent: {
    display: "block",
    color: colorTokens.foreground,
    fontWeight: 500,
  },
  flowNodeDescription: {
    display: "block",
    marginTop: "0.125rem",
    color: colorTokens.text,
    lineHeight: 1.5,
  },
  flowArrow: {
    margin: "0 0 0.5rem",
    color: colorTokens.mutedForeground,
    fontFamily: typographyTokens.monospaceFont,
    fontSize: "0.75rem",
  },
  links: {
    marginTop: "0.75rem",
  },
  importantLink: {
    fontWeight: 500,
  },
});
