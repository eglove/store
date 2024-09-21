import { projectBuilder } from "@ethang/project-builder/project-builder.js";

await projectBuilder("store", "master", {
  isLibrary: true,
  publishDirectory: "dist",
  scripts: [],
  tsConfigOverrides: {
    compilerOptions: {
      emitDeclarationOnly: true,
      outDir: "dist",
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
