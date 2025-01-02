import fs from "fs/promises";
import { Transform } from "stream";
import path from "path";

export async function streamReact(
  res,
  render,
  url,
  template,
  __dirname,
  isProduction
) {
  const ssrManifest = isProduction
    ? await fs.readFile(
        path.join(__dirname, "./dist/client/.vite/ssr-manifest.json"),
        "utf-8"
      )
    : undefined;

  let didError = false;

  const { pipe, abort } = render(url, ssrManifest, {
    onShellError() {
      res.status(500);
      res.set({ "Content-Type": "text/html" });
      res.send("<h1>Something went wrong</h1>");
    },
    onShellReady() {
      res.status(didError ? 500 : 200);
      res.set({
        "Content-Type": "text/html",
      });

      const transformStream = new Transform({
        transform(chunk, encoding, callback) {
          res.write(chunk, encoding);
          callback();
        },
      });

      const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);

      res.write(htmlStart);

      transformStream.on("finish", () => {
        res.end(htmlEnd);
      });

      pipe(transformStream);
    },
    onError(error) {
      didError = true;
      console.error(error);
    },
  });

  return abort;
}
