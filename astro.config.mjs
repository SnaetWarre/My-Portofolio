import { defineConfig } from "astro/config";
import stylex from "@stylexjs/unplugin";

export default defineConfig({
  site: "https://snaetwarre.github.io",
  base: "/My-Portofolio",
  build: {
    format: "file",
  },
  vite: {
    // StyleX injects its global rules into one CSS asset. Share that asset
    // across all routes, including pages with additional KaTeX styles.
    build: { cssCodeSplit: false },
    plugins: [stylex.vite()],
  },
});
