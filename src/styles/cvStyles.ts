import * as stylex from "@stylexjs/stylex";
import { colorTokens, cvColorTokens } from "./tokens.stylex";

export const cvStyles = stylex.create({
  document: {
    minWidth: 320,
    backgroundColor: {
      default: cvColorTokens.screenCanvas,
      "@media print": colorTokens.background,
    },
    color: colorTokens.foreground,
    colorScheme: "light",
    fontFamily: '"Liberation Sans", Arial, sans-serif',
    fontSize: "10pt",
    lineHeight: 1.36,
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
    textDecorationColor: "rgb(0 0 0 / 50%)",
    textDecorationThickness: "0.7px",
    textUnderlineOffset: "1.5px",
  },
  toolbar: {
    display: {
      default: "flex",
      "@media print": "none",
    },
    position: "sticky",
    zIndex: 2,
    top: 0,
    justifyContent: "center",
    gap: "0.8rem",
    padding: "0.7rem",
    borderBottomWidth: "2px",
    borderBottomStyle: "solid",
    borderBottomColor: colorTokens.foreground,
    backgroundColor: colorTokens.background,
  },
  toolbarAction: {
    boxSizing: "border-box",
    display: "inline-flex",
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    padding: "0.45rem 0.75rem",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: colorTokens.foreground,
    backgroundColor: {
      default: "transparent",
      ":hover": colorTokens.foreground,
    },
    color: {
      default: colorTokens.foreground,
      ":hover": colorTokens.background,
    },
    fontWeight: 700,
    textDecorationLine: "none",
    outline: {
      default: "none",
      ":focus-visible": "3px solid #000",
    },
    outlineOffset: {
      default: 0,
      ":focus-visible": 3,
    },
    transitionDuration: "100ms",
    transitionProperty: "background-color, color",
  },
  resume: {
    boxSizing: "border-box",
    width: {
      default: "210mm",
      "@media (max-width: 780px)": "100%",
    },
    minHeight: {
      default: "297mm",
      "@media (max-width: 780px)": "auto",
    },
    margin: {
      default: "1.5rem auto 3rem",
      "@media (max-width: 780px)": 0,
    },
    padding: {
      default: "13mm 14mm 12mm",
      "@media (max-width: 780px)": "1.2rem",
    },
    backgroundColor: colorTokens.background,
    boxShadow: {
      default: "0 10px 40px rgb(0 0 0 / 12%)",
      "@media (max-width: 780px)": "none",
    },
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
    borderBottomWidth: "2px",
    borderBottomStyle: "solid",
    borderBottomColor: colorTokens.foreground,
  },
  primaryHeading: {
    marginTop: 0,
    marginBottom: "1.5mm",
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "29pt",
    fontWeight: 500,
    letterSpacing: "-0.04em",
    lineHeight: 1,
  },
  role: {
    marginTop: 0,
    marginBottom: 0,
    color: cvColorTokens.secondaryInk,
    fontSize: "12pt",
    fontWeight: 700,
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
    fontSize: "9.4pt",
    letterSpacing: "0.11em",
    lineHeight: 1.1,
    textTransform: "uppercase",
  },
  subsectionHeading: {
    marginTop: 0,
    marginBottom: "0.4mm",
    fontSize: "9.8pt",
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
    fontWeight: 700,
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
    fontSize: "8.4pt",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
});
