import express from "express";
import { config } from "dotenv";
import renderReact from "../react SSR functions/renderReact.js";
import { throwError } from "../utilities/utils.js";
const renderPages = express.Router();
config();
const isProduction = process.env.NODE_ENV === "production";

// in development add vite middleware
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: {
      middlewareMode: true,
    },
    appType: "custom",
  });
  renderPages.use(vite.middlewares);
}

// RSC
renderPages.use("/rsc", async (req, res, next) => {
  try {
    const url = req.originalUrl.replace("/", "");
    await renderReact(req, res, url, vite);
  } catch (err) {
    next(err);
  }
});

//conference page
renderPages.use("/conf", async (req, res, next) => {
  try {
    const url = req.originalUrl.replace("/", "");
    await renderReact(req, res, url, vite);
  } catch (err) {
    next(err);
  }
});

// Serve landing page
renderPages.use("*", async (req, res, next) => {
  try {
    const url = req.originalUrl.replace("/", "");
    const comp =
      url === ""
        ? "root"
        : throwError(`Invalid page requested for url: /${url}`, 500);
    await renderReact(req, res, comp, vite);
  } catch (err) {
    next(err);
  }
});

export default renderPages;
export { vite };
