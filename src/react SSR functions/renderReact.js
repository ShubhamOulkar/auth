import {
  renderDevelopment,
  renderProduction,
  streamReact,
  validatePaths,
} from "./exportSSRFuctions.js";
const isProduction = process.env.NODE_ENV === "production";
const base = process.env.BASE || "/";

export default async function renderReact(req, res, componentName, viteDevObj) {
  try {
    const url = req.originalUrl.replace(base, "");
    console.log("url:", url);

    // Validate paths before proceeding
    const { fullTemplatePath, fullEntryPath } = validatePaths(componentName);

    const { template, render } = !isProduction
      ? await renderDevelopment(
          viteDevObj,
          url,
          fullTemplatePath,
          fullEntryPath
        )
      : await renderProduction(fullTemplatePath, fullEntryPath);

    const abort = await streamReact(res, render, url, template);

    // setTimeout(() => {
    //   abort();
    // }, ABORT_DELAY);
  } catch (e) {
    viteDevObj?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
}
