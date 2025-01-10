import path from "path";
import { fileURLToPath } from "url";

export default function getParentDirectoryName() {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilePath);
  const __dirname = path.dirname(path.dirname(currentDir));
  return __dirname;
}
