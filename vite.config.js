import { defineConfig } from "vite";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
  base: "/-novem-ever-yours-/",
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
