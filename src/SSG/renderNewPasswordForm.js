import vite from "../routes/renderPages.js";
import { validatePath } from "../react SSR functions/validatePath.js";
import { renderDevelopment } from "../react SSR functions/renderDevelopment.js";
import { renderProduction } from "../react SSR functions/renderProduction.js";
const isProduction = process.env.NODE_ENV === "production";

/**
 * Renders a component to string with error handling
 * @param {ErrorState} err - ErrorState object
 * @param {string} componentName - Name of the component
 * @param {import('vite').ViteDevServer} vite - Vite dev server instance
 * @returns {Promise<string>} Rendered HTML string
 */
export default async function renderNewPasswordForm(componentName) {
  try {
    const { fullTemplatePath, fullEntryPath } = validatePath("newpassword");

    let { template, render } = isProduction
      ? await renderProduction(fullEntryPath, fullEntryPath)
      : await renderDevelopment(componentName, fullTemplatePath, fullEntryPath);

    const { prelude } = await render();

    return new Promise((resolve, reject) => {
      let data = "";
      prelude.on("error", (err) => {
        console.error(
          "Stream error in new password form generation on server:",
          err
        );
        reject({
          status: 500,
          message: "Error in rendering react component into HTML chunks",
        });
      });
      prelude.on("data", (chunk) => {
        data += chunk;
        template = template.replace("<!--new-pass-form-->", data);
      });
      prelude.on("end", () => resolve(template));
    });
  } catch (err) {
    throw err;
  }
}
