import fs from "fs/promises";

export async function renderProduction(fullTemplatePath, fullEntryPath) {
  try {
    let template;
    // render production template .js file
    template = await fs.readFile(fullTemplatePath, "utf-8");
    let render = (await import(fullEntryPath)).render;

    return { template, render };
  } catch (err) {
    console.error("Error in SSR production render:", err);
  }
}
