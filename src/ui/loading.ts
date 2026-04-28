export function hideLoadingScreen() {
  const loading = document.querySelector<HTMLElement>("#loading-screen");
  window.setTimeout(() => loading?.classList.add("is-hidden"), 450);
}
