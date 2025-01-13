import express from "express";
import { config } from "dotenv";
import renderReact from "../react SSR functions/renderReact.js";
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
renderPages.use("/rsc", async (req, res) => {
  await renderReact(req, res, "rsc", vite);
});

//conference page
renderPages.use("/conf", async (req, res) => {
  await renderReact(req, res, "conf", vite);
});

// Serve landing page
renderPages.use("*", async (req, res) => {
  await renderReact(req, res, "root", vite);
});

export default renderPages;
