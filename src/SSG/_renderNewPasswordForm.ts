/* eslint-disable @typescript-eslint/ban-ts-comment */
import { validatePath } from "../react-SSR-functions/validatePath.js";
import { renderDevelopment } from "../react-SSR-functions/renderDevelopment.js";
import { renderProduction } from "../react-SSR-functions/renderProduction.js";
const isProduction = process.env.NODE_ENV === "production";

export default async function renderNewPasswordForm(componentName: string) {
  const { fullTemplatePath, fullEntryPath } = validatePath("newpassword");
  //@ts-ignore
  // eslint-disable-next-line prefer-const
  let { template, render } = isProduction
    ? await renderProduction(fullEntryPath, fullEntryPath)
    : await renderDevelopment(componentName, fullTemplatePath, fullEntryPath);

  const { prelude } = await render();

  return new Promise((resolve, reject) => {
    let data = "";

    prelude.on("error", (err: unknown) => {
      console.error(
        "Stream error in new password form generation on server:",
        err
      );
      reject({
        status: 500,
        message: "Error in rendering react component into HTML chunks",
      });
    });

    prelude.on("data", (chunk: string) => {
      data += chunk;
      template = template.replace("<!--new-pass-form-->", data);
    });
    prelude.on("end", () => resolve(template));
  });
}
