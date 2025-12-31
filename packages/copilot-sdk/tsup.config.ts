import { defineConfig } from "tsup";
import { copyFileSync, mkdirSync } from "fs";
import { dirname } from "path";

export default defineConfig({
  entry: {
    "core/index": "src/core/index.ts",
    "react/index": "src/react/index.ts",
    "ui/index": "src/ui/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  treeshake: true,
  splitting: true,
  onSuccess: async () => {
    // Copy CSS file for theming
    mkdirSync("dist", { recursive: true });
    copyFileSync("src/ui/styles/globals.css", "dist/styles.css");
  },
});
