import fs from "fs";
import { pathToFileURL } from "url";
const isProduction = process.env.NODE_ENV === "production";

export function validatePath(componentName) {
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

function generatePaths(componentName) {
  if (!componentName || typeof componentName !== "string") {
    throw new Error(`Invalid component name: ${componentName}`);
  }

  let templatePath = isProduction
    ? `./dist/client/views/${componentName}/${componentName}.html`
    : `./views/${componentName}/${componentName}.html`;

  let entryPath = isProduction
    ? `./dist/server/${componentName}/entry-server.js`
    : `./views/${componentName}/entry-server.tsx`;
  return { templatePath, entryPath };
}
