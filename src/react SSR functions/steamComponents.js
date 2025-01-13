import { Transform } from "node:stream";

export async function streamReact(res, render, url, template) {
  let didError = false;

  const { pipe, abort } = render(url, {
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
