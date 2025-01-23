import fs from "fs/promises";

export async function renderDevelopment(
  url,
  fullTemplatePath,
  fullEntryPath,
  viteDevObj
) {
  console.log("Rendering fresh template in development");
  try {
    let template;
    // Always render fresh template in development .tsx
    template = await fs.readFile(fullTemplatePath, "utf-8");
    template = await viteDevObj.transformIndexHtml(url, template);
    let render = (await viteDevObj.ssrLoadModule(fullEntryPath)).render;
    return { template, render };
  } catch (err) {
    console.error("Error in SSR dev render:", err);
  }
}
