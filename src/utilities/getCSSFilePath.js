import fs from "node:fs/promises";
import path from "path";

export default async function getCSSFilePath(componentName) {
  try {
    // Read the manifest.json created by Vite build
    const manifest = JSON.parse(
      await fs.readFile(
        path.resolve(`./dist/server/${componentName}/.vite/manifest.json`),
        "utf-8"
      )
    );

    return manifest[`views/${componentName}/entry-server.tsx`].css[0];
  } catch (err) {
    console.error("Error in reading manifest.json: ", err.message);
  }
}
