import express from "express";
import { config } from "dotenv";
import { createServer as createDevServer } from "vite";
import renderReact from "../react SSR functions/renderReact.js";
const renderPages = express.Router();
config();
const isProduction = process.env.NODE_ENV === "production";

// in development add vite middleware
let vite;
if (!isProduction) {
  vite = await createDevServer({
    server: {
      middlewareMode: true,
    },
    appType: "custom",
  });
  renderPages.use(vite.middlewares);
}

//conference page
renderPages.use("/conf", async (req, res) => {
  await renderReact(req, res, "conf", vite);
});

// Serve landing page
renderPages.use("*", async (req, res) => {
  await renderReact(req, res, "root", vite);
});

export default renderPages;
