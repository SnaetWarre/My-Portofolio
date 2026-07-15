document.querySelectorAll('a[href^="http"]').forEach((anchor) => {
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
});

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
