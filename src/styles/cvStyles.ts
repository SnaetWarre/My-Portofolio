import * as stylex from "@stylexjs/stylex";
import { colorTokens, cvColorTokens, layoutTokens, typographyTokens } from "./tokens.stylex";

export const cvStyles = stylex.create({
  document: {
    minWidth: 320,
    backgroundColor: cvColorTokens.screenCanvas,
    color: colorTokens.foreground,
    fontFamily: typographyTokens.bodyFont,
  },
  body: {
    width: {
      default: "auto",
      "@media print": "210mm",
    },
    minWidth: {
      default: 0,
      "@media print": "210mm",
    },
    margin: 0,
  },
  link: {
    color: "inherit",
    textDecorationColor: "rgb(var(--ink) / 50%)",
    textDecorationThickness: "0.7px",
    textUnderlineOffset: "1.5px",
  },
  // Same top line as the rest of the site, hidden in print.
  toolbar: {
    display: {
      default: "block",
      "@media print": "none",
    },
    padding: `${layoutTokens.pageInset} ${layoutTokens.pageInset} 0`,
    fontSize: "0.875rem",
    lineHeight: 1.43,
  },
  // The sheet sets its own print sizes, so rem stays the site's 16px.
  resume: {
    boxSizing: "border-box",
    fontSize: "10pt",
    lineHeight: 1.36,
    width: {
      default: "210mm",
      "@media (max-width: 780px)": "100%",
    },
    minHeight: {
      default: "297mm",
      "@media (max-width: 780px)": "auto",
    },
    margin: {
      default: `3.75rem ${layoutTokens.pageInset} 6rem`,
      "@media (max-width: 780px)": "2rem 0 0",
    },
    marginBlock: { default: null, "@media print": 0 },
    marginInline: { default: null, "@media print": 0 },
    padding: {
      default: "13mm 14mm 12mm",
      "@media (max-width: 780px)": "1.2rem",
    },
    backgroundColor: {
      default: cvColorTokens.sheet,
      "@media print": colorTokens.background,
    },
    // StyleX can't combine a width query and a print query on one property,
    // so the phone rule sets the width and the print rule the style.
    borderWidth: {
      default: 1,
      "@media (max-width: 780px)": 0,
    },
    borderStyle: {
      default: "solid",
      "@media print": "none",
    },
    borderColor: cvColorTokens.subtleRule,
  },
  resumeHeader: {
    display: "grid",
    gridTemplateColumns: {
      default: "1fr auto",
      "@media (max-width: 780px)": "1fr",
    },
    alignItems: "start",
    gap: "12mm",
    paddingBottom: "5mm",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: cvColorTokens.subtleRule,
  },
  primaryHeading: {
    marginTop: 0,
    marginBottom: "1.5mm",
    fontSize: "24pt",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    lineHeight: 1,
  },
  role: {
    marginTop: 0,
    marginBottom: 0,
    color: cvColorTokens.secondaryInk,
    fontSize: "11pt",
    fontWeight: 500,
  },
  contactList: {
    display: "grid",
    gap: "0.55mm",
    margin: 0,
    fontSize: "8.2pt",
    fontStyle: "normal",
    textAlign: {
      default: "right",
      "@media (max-width: 780px)": "left",
    },
  },
  contactLink: {
    // Keep phone and email links comfortably tappable on small screens.
    lineHeight: {
      default: null,
      "@media (max-width: 780px)": "24px",
    },
  },
  summary: {
    display: "grid",
    gridTemplateColumns: {
      default: "27mm 1fr",
      "@media (max-width: 780px)": "1fr",
    },
    gap: "5mm",
    padding: "4.5mm 0",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: cvColorTokens.subtleRule,
  },
  summaryContent: {
    marginBottom: 0,
  },
  resumeGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 2.16fr) minmax(0, 0.84fr)",
      "@media (max-width: 780px)": "1fr",
    },
    gap: "8mm",
    paddingTop: "5mm",
  },
  sideColumn: {
    paddingLeft: {
      default: "6mm",
      "@media (max-width: 780px)": 0,
    },
    borderLeftWidth: {
      default: "1px",
      "@media (max-width: 780px)": 0,
    },
    borderLeftStyle: "solid",
    borderLeftColor: cvColorTokens.subtleRule,
  },
  sectionHeading: {
    marginTop: 0,
    marginBottom: "3mm",
    fontSize: "10.5pt",
    fontWeight: 600,
    lineHeight: 1.1,
  },
  subsectionHeading: {
    marginTop: 0,
    marginBottom: "0.4mm",
    fontSize: "9.8pt",
    fontWeight: 600,
    lineHeight: 1.2,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: "2mm",
  },
  list: {
    marginTop: 0,
    marginBottom: 0,
    paddingLeft: "4mm",
  },
  listItem: {
    marginBottom: "1.15mm",
    paddingLeft: "0.5mm",
  },
  spacedEntry: {
    marginTop: "4mm",
  },
  entryHeading: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "4mm",
    marginBottom: "1.5mm",
  },
  organisation: {
    marginTop: 0,
    marginBottom: 0,
    color: cvColorTokens.secondaryInk,
    fontWeight: 500,
  },
  date: {
    marginTop: 0,
    marginBottom: 0,
    color: cvColorTokens.secondaryInk,
    fontSize: "8.2pt",
    whiteSpace: "nowrap",
  },
  projectsSection: {
    marginTop: "5mm",
  },
  compactEntry: {
    marginTop: "2.7mm",
  },
  compactParagraph: {
    marginBottom: 0,
  },
  sideSection: {
    marginTop: "6mm",
  },
  sideParagraph: {
    marginBottom: "1.4mm",
  },
  sideDate: {
    marginTop: "1mm",
  },
  smallText: {
    color: cvColorTokens.secondaryInk,
    fontSize: "8.3pt",
  },
  skillGroup: {
    marginTop: "3mm",
  },
  skillHeading: {
    marginBottom: "0.8mm",
    color: cvColorTokens.secondaryInk,
    fontSize: "8.6pt",
    fontWeight: 500,
  },
});
