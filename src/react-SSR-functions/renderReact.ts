import { Request, Response } from "express";
import viteDevServer from "../../viteDevServer.js";
import { streamReact, validatePath, handleError } from "./exportSSRFuctions.js";
import { ErrorHandler } from "../type.js";
const isProduction = process.env.NODE_ENV === "production";

export default async function renderReact(
  _req: Request,
  res: Response,
  componentName: string
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
          fullEntryPath
        );

    await streamReact(res, render, componentName, template);
  } catch (e) {
    if (e instanceof Error) viteDevServer?.ssrFixStacktrace(e);
    handleError(e as ErrorHandler);
  }
}
