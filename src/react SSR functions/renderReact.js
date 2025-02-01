import { streamReact, validatePath, handleError } from "./exportSSRFuctions.js";
import viteDevServer from "../../viteDevServer.js";
const isProduction = process.env.NODE_ENV === "production";

/**
 * Server-side renders a React component based on environment (development/production)
 *
 * @param {import('express').Request} _req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {string} componentName - Name/path of the React component to render
 * @param {Object} viteDevObj - Vite development server instance object
 * @throws {Error} When page validation fails or rendering errors occur error.stack is rendered only in development
 * @returns {Promise<void>} Renders component and streams response
 *
 * @example
 *  Usage in Express route
 * app.get('/page', (req, res) => {
 *   await renderReact(req, res, 'pages/HomePage', vite);
 * });
 */

export default async function renderReact(_req, res, componentName) {
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

    const abort = await streamReact(res, render, componentName, template);
  } catch (e) {
    viteDevServer?.ssrFixStacktrace(e);
    handleError(e);
  }
}
