import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { Transform } from "stream";
import fs from "fs/promises";
import { createServer as createDevServer } from "vite";
import { config } from "dotenv";
config();
import auth from "./src/routes/auth.js";
import { connectMongo } from "./src/db/dbUtils.js";
import verifyToken from "./src/middleware/verifySession.js";
import errorHandler from "./src/middleware/errorHandler.js";
import compression from "compression";
import sirv from "sirv";
// import clientHttpValidation from "./src/utilities/clientHttpValidation.js";
// import getFileModifiedTime from "./src/utilities/getFileModifiedTime.js";
import clientHttpValidation from "./src/middleware/clientHttpValidation.js";

const port = process.env.PORT || 3330;
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
connectMongo();

// middlewares
app.use(morgan("tiny"));
app.use(cors(corsOptions));
app.use(express.json());

// authontication and authorization routes
app.use("/auth", verifyToken, auth);
app.use(errorHandler);

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
  // cache validation
  app.use(clientHttpValidation(clientFolderpath));
}

// React component rendering client route
// serve home page
// must use *, otherwise on page refresh; client sent get request to server
// and server will send http code on all request
app.use("*", async (req, res) => {
  try {
    // caching response in production only
    // let validation = await clientHttpValidation(req, clientFilepath);

    // if (validation.ok && isProduction) {
    //   res.setHeader("Cache-Control", "no-cache");
    //   res.setHeader("Last-Modified", validation.time);
    //   res.sendStatus(304);
    //   return;
    // }

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

    // set last modified date for client validation
    // const lastModifiedDate = await getFileModifiedTime(clientFilepath);

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
          // "Last-Modified": lastModifiedDate,
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
});

app
  .listen(port, () => {
    console.log(
      `Auth-SSR ${process.env.NODE_ENV} server is running at http://localhost:${port}`
    );
  })
  .on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.log(`Port ${port} is in use, trying another port...`);
      app.listen(port + 1, () => {
        console.log(
          `Auth-SSR ${
            process.env.NODE_ENV
          } server is now running at http://localhost:${port + 1}`
        );
      });
    }
  });
