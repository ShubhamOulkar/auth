import fs from "fs/promises";
import viteDevServer from "../../viteDevServer.js";

export async function renderDevelopment(url, fullTemplatePath, fullEntryPath) {
  console.log("Rendering fresh template in development");
  try {
    let template;
    // Always render fresh template in development .tsx
    template = await fs.readFile(fullTemplatePath, "utf-8");
    template = await viteDevServer.transformIndexHtml(url, template);
    let render = (await viteDevServer.ssrLoadModule(fullEntryPath)).render;
    return { template, render };
  } catch (err) {
    console.error("Error in SSR dev render:", err);
  }
}
