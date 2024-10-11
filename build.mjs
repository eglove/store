import { projectBuilder } from "@ethang/project-builder/project-builder.js";

await projectBuilder("store", "master", {
  isLibrary: true,
  publishDirectory: "dist",
  scripts: ["pnpm up -i --latest", "pnpm dedupe", "pnpm lint"],
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
