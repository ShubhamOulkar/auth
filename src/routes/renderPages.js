import express from "express";
import { config } from "dotenv";
import renderReact from "../react SSR functions/renderReact.js";
import { throwError } from "../utilities/utils.js";
import renderToString from "../SSG/renderToString.js";
import viteDevServer from "../../viteDevServer.js";
const renderPages = express.Router();
config();
const isProduction = process.env.NODE_ENV === "production";

// in development add vite middleware
if (!isProduction) {
  renderPages.use(viteDevServer.middlewares);
}

renderPages.use("/profile", async (req, res, next) => {
  try {
    const url = req.originalUrl.replace("/", "");
    url !== "profile" &&
      throwError(`Invalid page requested for url: /${url}`, 500);
    await renderReact(req, res, url);
  } catch (err) {
    next(err);
  }
});

renderPages.use("/forgotpassword", async (req, res, next) => {
  try {
    const url = req.originalUrl.replace("/", "");
    url !== "forgotpassword" &&
      throwError(`Invalid page requested for url: /${url}`, 500);
    await renderReact(req, res, url);
  } catch (err) {
    next(err);
  }
});

renderPages.use("/signup", async (req, res, next) => {
  try {
    const url = req.originalUrl.replace("/", "");
    url !== "signup" &&
      throwError(`Invalid page requested for url: /${url}`, 500);
    await renderReact(req, res, url);
  } catch (err) {
    next(err);
  }
});

renderPages.use("/login", async (req, res, next) => {
  try {
    const url = req.originalUrl.replace("/", "");
    url !== "login" &&
      throwError(`Invalid page requested for url: /${url}`, 500);
    await renderReact(req, res, url);
  } catch (err) {
    next(err);
  }
});

// landing page
renderPages.use("*", async (req, res, next) => {
  try {
    const url = req.originalUrl.replace("/", "");
    const comp =
      url !== ""
        ? throwError(`Invalid page requested for url: /${url}`, 500)
        : "root";
    await renderReact(req, res, comp);
  } catch (err) {
    next(err);
  }
});

// invalid route handling middleware
renderPages.use(async (err, req, res, next) => {
  // log error on server
  console.error(`${err.message} : ${err.status} : `, err.stack);
  try {
    const htmlData = await renderToString(err, "error");
    res.set({
      "Content-Type": "text/html",
    });

    res.status(500).send(htmlData);
  } catch (err) {
    console.error("Error in rendering error page on server:", err.stack);
    res
      .status(500)
      .send("Internal Server Error : Error rendering error page on the server");
  }
});

export default renderPages;
