import * as stylex from "@stylexjs/stylex";
import { colorTokens, layoutTokens, typographyTokens } from "./tokens.stylex";

export const caseStudyStyles = stylex.create({
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
  navigation: {
    justifyContent: "space-between",
    marginBottom: "2.25rem",
  },
  header: {
    marginBottom: "2.25rem",
  },
  metadataLabel: {
    color: colorTokens.mutedForeground,
    fontFamily: typographyTokens.bodyFont,
    fontSize: "0.72rem",
    fontWeight: 500,
    letterSpacing: 0,
    textTransform: "none",
  },
  kicker: {
    marginTop: 0,
    marginBottom: "0.55rem",
  },
  heading: {
    marginTop: 0,
    marginBottom: "0.75rem",
    fontSize: "1.85rem",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    lineHeight: 1.2,
  },
  lead: {
    marginTop: 0,
    marginBottom: "1.25rem",
  },
  metadataList: {
    margin: 0,
  },
  metadataRow: {
    display: "grid",
    gridTemplateColumns: {
      default: "6.5rem minmax(0, 1fr)",
      "@media (max-width: 700px)": "5.5rem minmax(0, 1fr)",
    },
    gap: "0.75rem",
    alignItems: "center",
    padding: "0.3rem 0",
  },
  metadataTerm: {
    margin: 0,
  },
  metadataDescription: {
    margin: 0,
  },
  section: {
    marginTop: "2.25rem",
  },
  sectionLabel: {
    marginTop: 0,
    marginBottom: "0.35rem",
  },
  sectionHeading: {
    marginTop: 0,
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
    marginBottom: {
      default: "1rem",
      ":last-child": 0,
    },
  },
  subheading: {
    marginTop: "1.5rem",
    marginRight: 0,
    marginBottom: "0.55rem",
    marginLeft: 0,
    fontSize: "1.05rem",
  },
  list: {
    marginTop: 0,
    marginBottom: {
      default: "1rem",
      ":last-child": 0,
    },
    paddingLeft: "1.2rem",
  },
  listItem: {
    marginBottom: "0.65rem",
    paddingLeft: "0.15rem",
  },
  factsList: {
    marginTop: "1rem",
    marginBottom: 0,
  },
  emphasizedFact: {
    fontWeight: 600,
    "::after": {
      content: '": "',
    },
  },
  architecture: {
    marginTop: "1rem",
  },
  flowRow: {
    display: "contents",
  },
  flowNode: {
    marginBottom: "0.65rem",
    paddingLeft: "0.75rem",
    borderLeftWidth: "1px",
    borderLeftStyle: "solid",
    borderLeftColor: colorTokens.foreground,
  },
  flowNodeContent: {
    display: "block",
  },
  flowNodeDescription: {
    display: "block",
    color: colorTokens.mutedForeground,
  },
  flowArrow: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: "0.65rem",
    marginLeft: "0.75rem",
    color: colorTokens.mutedForeground,
    fontFamily: typographyTokens.monospaceFont,
  },
  figure: {
    marginTop: "1.25rem",
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  figureImage: {
    width: "100%",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colorTokens.borderLight,
  },
  figureCaption: {
    marginTop: "0.5rem",
    color: colorTokens.mutedForeground,
    fontSize: "0.82rem",
  },
  links: {
    marginTop: "1rem",
  },
  importantLink: {
    fontWeight: 600,
  },
  footer: {
    marginTop: "3rem",
  },
});
