import fs from "fs/promises";
import path from "path";

export async function renderProduction(__dirname) {
  try {
    let template;
    let render;
    // render production template .js file
    template = await fs.readFile(
      path.join(__dirname, "./dist/client/index.html"),
      "utf-8"
    );
    render = (await import("../../dist/server/entry-server.js")).render;

    return { template, render };
  } catch (err) {
    console.error("Error in SSR production render:", err);
  }
}
