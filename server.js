import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
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
import {
  renderDevelopment,
  renderProduction,
  streamReact,
} from "./src/react SSR functions/exportSSRFuctions.js";

config();

const port = process.env.PORT || 5500;
const isProduction = process.env.NODE_ENV === "production";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientFolderpath = "dist/client";

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

app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl;

    let template;
    let render;

    if (!isProduction) {
      // Always render fresh template in development .jsx
      const dev = await renderDevelopment(__dirname, vite, url);
      template = dev.template;
      render = dev.render;
    } else {
      // render production template .js file
      const prod = await renderProduction(__dirname);
      template = prod.template;
      render = prod.render;
    }

    const abort = await streamReact(
      res,
      render,
      url,
      template,
      __dirname,
      isProduction
    );

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
    `⚡Auth-SSR ${process.env.NODE_ENV} server is running at http://127.0.0.1:${port}`
  );
});
