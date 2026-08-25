import { defineConfig } from "astro/config";
import stylex from "@stylexjs/unplugin";

export default defineConfig({
  site: "https://snaetwarre.github.io",
  base: "/My-Portofolio",
  build: {
    format: "file",
  },
  vite: {
    plugins: [stylex.vite()],
  },
});
