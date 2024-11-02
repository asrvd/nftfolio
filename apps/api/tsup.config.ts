import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/app.ts"],
  format: ["esm"],
  target: "node20",
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  minify: false,
});
