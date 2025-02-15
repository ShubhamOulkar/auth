import fs from "node:fs/promises";
import path from "path";

export default async function getCSSFilePath(componentName: string) {
  try {
    // Read the manifest.json created by Vite build
    const manifest = JSON.parse(
      await fs.readFile(
        path.resolve(
          `./dist/ssr/serverViews/${componentName}/.vite/manifest.json`
        ),
        "utf-8"
      )
    );

    return `/dist/ssr/serverViews/${componentName}/${
      manifest[`client/views/${componentName}/entry-server.jsx`].css[0]
    }`;
  } catch (err) {
    console.error(
      "Error in reading manifest.json: ",
      err instanceof Error && err.message
    );
  }
}
