import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { Transform } from "stream";
import fs from "fs/promises";
import { createServer as createDevServer } from "vite";
import compression from "compression";
import sirv from "sirv";
import { config } from "dotenv";
import { connectMongo } from "./src/db/dbUtils.js";
import {
  clientHttpValidation,
  setSessionAndCsrfToken,
  errorHandler,
} from "./src/middleware/middlewareExpoter.js";
import { auth, googleAuth, twoFa } from "./src/routes/routesExporter.js";
import { throwError } from "./src/utilities/utils.js";
config();

const port = process.env.PORT || 5500;
const isProduction = process.env.NODE_ENV === "production";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientFolderpath = "dist/client";

//cached production assets
const templateHtml = isProduction
  ? await fs.readFile(path.join(__dirname, "./dist/client/index.html"), "utf-8")
  : "";
const ssrManifest = isProduction
  ? await fs.readFile(
      path.join(__dirname, "./dist/client/.vite/ssr-manifest.json"),
      "utf-8"
    )
  : undefined;

// http server applicaton
const app = express();

// cross platform settings
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from specific origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Set-Cookie",
  ],
  credentials: true,
  maxAge: 3600, // Specify maximum age of CORS configuration
};

// connect to mongoDB instance
await connectMongo();

// middlewares
app.use(morgan("tiny"));
app.use(cors(corsOptions));
app.use(express.text());

// authontication and authorization routes
app.use("/auth", auth);
// authenticate by google indentity route
app.use("/google", googleAuth);
// two factor authentication routes
app.use("/2fa", twoFa);

// in development add vite middleware
let vite;
if (!isProduction) {
  vite = await createDevServer({
    server: {
      middlewareMode: true,
    },
    appType: "custom",
  });
  app.use(vite.middlewares);
} else {
  // compress each request in production
  app.use(compression());
  //server static assets in production
  app.use("/", sirv("./dist/client", { extensions: [] }));
  //set cookie for session ID and csrf token on page load
  app.use(setSessionAndCsrfToken);
  // cache client pages in production only
  app.use(clientHttpValidation(clientFolderpath));
}

// set cookie for session ID and csrf token on page load only (page will reload after session expiration)
// !  remove this middware in production !
// app.use(setSessionAndCsrfToken);

app.use(errorHandler);
// React component rendering home page
// must use *, otherwise on page refresh; client sent get request to server
// and server will send http code on all request

app.use("/", async (req, res) => {
  try {
    const url = req.originalUrl;

    let template;
    let render;

    if (!isProduction) {
      // Always render fresh template in development .jsx
      template = await fs.readFile(path.join(__dirname, "index.html"), "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (
        await vite.ssrLoadModule(
          path.join(__dirname, "./client/entry-server.tsx")
        )
      ).render;
    } else {
      // render production template .js file
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
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
    // log error only on sever
    console.error(e.stack);
    // end response with exception message
    res.status(500).end("An exception occurred");
  }
});

app.listen(port, () => {
  console.log(
    `⚡Auth-SSR ${process.env.NODE_ENV} server is running at http://127.0.0.1:${port}⚡`
  );
});
