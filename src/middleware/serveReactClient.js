import path from "node:path";
import { fileURLToPath } from "node:url";
import { Transform } from "node:stream";
import fs from "node:fs/promises";
import { config } from "dotenv";
config();
import { createServer as createDevServer } from "vite";
import app from "../../server.js";

const isProduction = process.env.NODE_ENV === "production";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//cached production assets
const templateHtml = isProduction
  ? await fs.readFile(
      path.join(__dirname, "../../dist/client/index.html"),
      "utf-8"
    )
  : "";
const ssrManifest = isProduction
  ? await fs.readFile(
      path.join(__dirname, "../../dist/client/.vite/ssr-manifest.json"),
      "utf-8"
    )
  : undefined;

// vite build production bundle and store in dist folder and
//for development we have to configure vite server
let vite;
// vite = await createDevServer({
//   server: { middlewareMode: true },
//   appType: "custom",
// });

vite = await createDevServer({
  server: {
    middlewareMode: true,
  },
  appType: "custom",
});

/*
import http from 'http'
import { createServer } from 'vite'

const parentServer = http.createServer() // or express, koa, etc.

const vite = await createServer({
  server: {
    // Enable middleware mode
    middlewareMode: {
      // Provide the parent http server for proxy WebSocket
      server: parentServer,
    },
    proxy: {
      '/ws': {
        target: 'ws://localhost:3000',
        // Proxying WebSocket
        ws: true,
      },
    },
  },
})

parentServer.use(vite.middlewares)
 */

export async function serverClient(req, res) {
  try {
    const url = req.originalUrl;

    let template;
    let render;

    if (!isProduction) {
      // Always render fresh template in development .jsx
      template = await fs.readFile(
        path.join(__dirname, "../../index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);
      render = (
        await vite.ssrLoadModule(
          path.join(__dirname, "../../client/entry-server.jsx")
        )
      ).render;
    } else {
      // render production template .js file
      template = templateHtml;
      render = (await import("../../dist/server/entry-server.js")).render;
    }

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
          "Cache-Control": "public, max-age=10",
          Expires: new Date(Date.now() + 10).toUTCString(), // expires in 10 sec
          Vary: "Accept-Encoding",
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

    setTimeout(() => {
      abort();
    }, 10000);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
}
