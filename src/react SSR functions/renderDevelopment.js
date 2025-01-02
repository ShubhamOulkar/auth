import fs from "fs/promises";
import path from "path";

export async function renderDevelopment(__dirname, viteDevObj, url) {
  try {
    let template;
    let render;
    // Always render fresh template in development .jsx
    template = await fs.readFile(path.join(__dirname, "index.html"), "utf-8");
    template = await viteDevObj.transformIndexHtml(url, template);
    render = (
      await viteDevObj.ssrLoadModule(
        path.join(__dirname, "./client/entry-server.tsx")
      )
    ).render;

    return { template, render };
  } catch (err) {
    console.error("Error in SSR dev render:", err);
  }
}
