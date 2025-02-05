import { validatePath } from "../react-SSR-functions/validatePath.js";
import { renderDevelopment } from "../react-SSR-functions/renderDevelopment.js";
import { renderProduction } from "../react-SSR-functions/renderProduction.js";
import { ViteDevServer } from "vite";
const isProduction = process.env.NODE_ENV === "production";

export default async function renderNewPasswordForm(
  componentName: string,
  viteDevServer: ViteDevServer
) {
  try {
    const { fullTemplatePath, fullEntryPath } = validatePath("newpassword");
    //@ts-ignore
    let { template, render } = isProduction
      ? await renderProduction(fullEntryPath, fullEntryPath)
      : await renderDevelopment(
          componentName,
          fullTemplatePath,
          fullEntryPath,
          viteDevServer
        );

    const { prelude } = await render();

    return new Promise((resolve, reject) => {
      let data = "";
      //@ts-ignore
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
      //@ts-ignore
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
