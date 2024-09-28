import { projectBuilder } from "@ethang/project-builder/project-builder.js";

await projectBuilder("store", "master", {
  isLibrary: true,
  publishDirectory: "dist",
  scripts: ["bun x taze latest -w", "bun lint"],
  tsConfigOverrides: {
    compilerOptions: {
      emitDeclarationOnly: true,
    },
    include: ["src"],
  },
  tsupOptions: {
    bundle: true,
    entry: ["src"],
    format: ["esm"],
    minify: true,
    outDir: "dist",
  },
});
