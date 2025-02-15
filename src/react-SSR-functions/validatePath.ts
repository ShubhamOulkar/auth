import fs from "fs";
import { pathToFileURL } from "url";
const isProduction = process.env.NODE_ENV === "production";

export function validatePath(componentName: string) {
  const { templatePath, entryPath } = generatePaths(componentName);

  const templateExists = fs.existsSync(pathToFileURL(templatePath));
  const entryExists = fs.existsSync(pathToFileURL(entryPath));

  if (!templateExists || !entryExists) {
    throw new Error(
      `Invalid paths:\n${
        !templateExists ? `Template not found: ${templatePath}\n` : ""
      }${!entryExists ? `Entry file not found: ${entryPath}` : ""}`
    );
  }

  return {
    fullTemplatePath: templatePath,
    fullEntryPath: entryPath,
  };
}

function generatePaths(componentName: string) {
  if (!componentName || typeof componentName !== "string") {
    throw new Error(`Invalid component name: ${componentName}`);
  }

  const templatePath = isProduction
    ? `./dist/ssr/client/views/${componentName}/${componentName}.html`
    : `./client/views/${componentName}/${componentName}.html`;

  const entryPath = isProduction
    ? `./dist/ssr/serverViews/${componentName}/entry-server.js`
    : `./client/views/${componentName}/entry-server.tsx`;
  return { templatePath, entryPath };
}
