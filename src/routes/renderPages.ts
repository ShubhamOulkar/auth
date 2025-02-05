import express, { NextFunction, Router } from "express";
import { config } from "dotenv";
import renderReact from "../react-SSR-functions/renderReact.js";
import { throwError } from "../utilities/utils.js";
import renderToString from "../SSG/renderToString.js";
import viteDevServer from "../../viteDevServer.js";
const renderPages: Router = express.Router();
config();
const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  renderPages.use(viteDevServer.middlewares);
}

renderPages.use("/profile", async (req, res, next) => {
  try {
    const url = req.originalUrl.replace("/", "");
    url !== "profile" &&
      throwError(`Invalid page requested for url: /${url}`, 500);
    await renderReact(req, res, url, viteDevServer);
  } catch (err) {
    next(err);
  }
});

renderPages.use("/forgotpassword", async (req, res, next) => {
  try {
    const url = req.originalUrl.replace("/", "");
    url !== "forgotpassword" &&
      throwError(`Invalid page requested for url: /${url}`, 500);
    await renderReact(req, res, url, viteDevServer);
  } catch (err) {
    next(err);
  }
});

renderPages.use("/signup", async (req, res, next) => {
  try {
    const url = req.originalUrl.replace("/", "");
    url !== "signup" &&
      throwError(`Invalid page requested for url: /${url}`, 500);
    await renderReact(req, res, url, viteDevServer);
  } catch (err) {
    next(err);
  }
});

renderPages.use("/login", async (req, res, next) => {
  try {
    const url = req.originalUrl.replace("/", "");
    url !== "login" &&
      throwError(`Invalid page requested for url: /${url}`, 500);
    await renderReact(req, res, url, viteDevServer);
  } catch (err) {
    next(err);
  }
});

// landing page
renderPages.use("*", async (req, res, next) => {
  try {
    const url = req.originalUrl.replace("/", "");
    if (url !== "") {
      throwError(`Invalid page requested for url: /${url}`, 500);
    }
    await renderReact(req, res, "root", viteDevServer);
  } catch (err) {
    next(err);
  }
});

// invalid route handling middleware
renderPages.use(async (err: any, _req: any, res: any, _next: NextFunction) => {
  // log error on server
  console.error(`${err.message} : ${err.status} : `, err.stack);
  try {
    const htmlData = await renderToString(err, "error");
    res.set({
      "Content-Type": "text/html",
    });

    res.status(500).send(htmlData);
  } catch (err) {
    //@ts-ignore
    console.error("Error in rendering error page on server:", err.stack);
    res
      .status(500)
      .send("Internal Server Error : Error rendering error page on the server");
  }
});

export default renderPages;
