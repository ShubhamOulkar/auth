import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import getParentDirectoryName from "../utilities/getParentDirectoryName.js";
const isProduction = process.env.NODE_ENV === "production";
const __dirname = getParentDirectoryName();

export function validatePaths(componentName) {
  const { templatePath, entryPath } = generatePaths(componentName);

  const fullTemplatePath = path.join(__dirname, templatePath);
  const fullEntryPath = path.join(__dirname, entryPath);

  const templateExists = fs.existsSync(fullTemplatePath);
  const entryExists = fs.existsSync(fullEntryPath);

  if (!templateExists || !entryExists) {
    throw new Error(
      `Invalid paths:\n${
        !templateExists ? `Template not found: ${fullTemplatePath}\n` : ""
      }${!entryExists ? `Entry file not found: ${fullEntryPath}` : ""}`
    );
  }

  return {
    fullTemplatePath: isProduction
      ? pathToFileURL(fullTemplatePath)
      : fullTemplatePath,
    fullEntryPath: isProduction ? pathToFileURL(fullEntryPath) : fullEntryPath,
  };
}

function generatePaths(componentName) {
  let templatePath;
  let entryPath;

  if (!componentName || typeof componentName !== "string") {
    throw new Error(`Invalid component name: ${componentName}`);
  }

  templatePath = isProduction
    ? `./dist/client/pages/${componentName}/index.html`
    : `./pages/${componentName}/index.html`;

  entryPath = isProduction
    ? `./dist/server/${componentName}/entry-server.js`
    : `./pages/${componentName}/entry-server.tsx`;

  return { templatePath, entryPath };
}
