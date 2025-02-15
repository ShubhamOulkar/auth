import fs from "fs/promises";
import viteDevServer from "../../viteDevServer.js";

export async function renderDevelopment(
  url: string,
  fullTemplatePath: string,
  fullEntryPath: string
) {
  console.log("Rendering fresh template in development");
  try {
    let template;
    // Always render fresh template in development .jsx
    template = await fs.readFile(fullTemplatePath, "utf-8");
    template = await viteDevServer.transformIndexHtml(url, template);
    const render = (await viteDevServer.ssrLoadModule(fullEntryPath)).render;
    return { template, render };
  } catch (err) {
    console.error("Error in SSR dev render:", err);
  }
}
