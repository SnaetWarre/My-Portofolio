import "./styles/tokens.css";
import "./styles/base.css";

document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach((anchor) => {
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
});

const year = document.querySelector<HTMLElement>("#year");
if (year) year.textContent = String(new Date().getFullYear());
