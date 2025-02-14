import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

export async function renderProduction(
  fullTemplatePath: string,
  fullEntryPath: string
) {
  try {
    // Convert fullEntryPath to a valid file URL scheme
    const entryPath = path.resolve(fullEntryPath);
    const entryUrl = pathToFileURL(entryPath);
    const { render } = await import(entryUrl.href);
    const template = await fs.readFile(fullTemplatePath, "utf-8");

    return { template, render };
  } catch (err) {
    console.error("Error in SSR production render:", err);
  }
}
