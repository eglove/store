import { projectBuilder } from "@ethang/project-builder/project-builder.js";

await projectBuilder("store", "master", {
  isLibrary: true,
  publicDirectory: "dist",
  scripts: ["UPDATE", "DEDUPE", "LINT"],
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
