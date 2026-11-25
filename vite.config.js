import { defineConfig } from "vite";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
  // Relative URLs work both on the GitHub Pages project subpath and in the
  // root-mounted local production preview used by the visual audit.
  base: "./",
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: { input: resolve(process.cwd(), "index.html") }
  },
  plugins: [{
    name: "copy-anniversary-assets",
    closeBundle() {
      if (existsSync("assets")) {
        mkdirSync("dist", { recursive: true });
        cpSync("assets", "dist/assets", { recursive: true });
      }
    }
  }]
});
