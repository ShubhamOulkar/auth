import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

export async function renderProduction(fullTemplatePath, fullEntryPath) {
  try {
    // Convert fullEntryPath to a valid file URL scheme
    const entryPath = path.resolve(fullEntryPath);
    const entryUrl = pathToFileURL(entryPath);

    let render = (await import(entryUrl)).render;

    let template = await fs.readFile(fullTemplatePath, "utf-8");

    return { template, render };
  } catch (err) {
    console.error("Error in SSR production render:", err);
  }
}
