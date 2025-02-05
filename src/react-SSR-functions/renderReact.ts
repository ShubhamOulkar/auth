import { ViteDevServer } from "vite";
import { streamReact, validatePath, handleError } from "./exportSSRFuctions.js";
// import viteDevServer from "../../viteDevServer.js";
const isProduction = process.env.NODE_ENV === "production";

export default async function renderReact(
  _req: any,
  res: any,
  componentName: string,
  vite?: ViteDevServer
) {
  try {
    // Validate pages before proceeding
    const { fullTemplatePath, fullEntryPath } = validatePath(componentName);

    // Dynamic import based on environment
    const renderModule = await import(
      isProduction ? "./renderProduction.js" : "./renderDevelopment.js"
    );

    const { template, render } = isProduction
      ? await renderModule.renderProduction(fullTemplatePath, fullEntryPath)
      : await renderModule.renderDevelopment(
          componentName,
          fullTemplatePath,
          fullEntryPath,
          vite
        );

    await streamReact(res, render, componentName, template);
  } catch (e) {
    //@ts-ignore
    vite?.ssrFixStacktrace(e);
    //@ts-ignore
    handleError(e);
  }
}
