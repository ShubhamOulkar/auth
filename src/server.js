import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import { connectMongo } from "./db/dbUtils.js";
import renderToString from "./SSG/renderToString.js";
import {
  auth,
  googleAuth,
  twoFa,
  renderPages,
} from "./routes/routesExporter.js";
import { vite } from "./routes/renderPages.js";
import { productionMiddlewares } from "./middleware/productionMiddlewares.js";
config();

const port = process.env.PORT || 5500;
const isProduction = process.env.NODE_ENV === "production";
const ABORT_DELAY = 10000; //10 sec

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
app.use(morgan(isProduction ? "combined" : "dev"));
app.use(cors(corsOptions));

// Add request timeout middleware
app.use((req, res, next) => {
  const timeout = setTimeout(() => {
    res.status(408);
    res.set({
      "Content-Type": "text/html",
    });
    res.send(`Request Timeout ${ABORT_DELAY}ms for ${req.originalUrl}`);
  }, ABORT_DELAY);

  res.on("finish", () => clearTimeout(timeout));
  next();
});

// authontication and authorization routes
app.use("/auth", auth);
// authenticate by google indentity route
app.use("/google", googleAuth);
// two factor authentication routes
app.use("/2fa", twoFa);

// production middlewares
if (isProduction) {
  app.use(productionMiddlewares);
}

// set cookie for session ID and csrf token on page load only (page will reload after session expiration)
// !  remove this middware in production, this middleware added for testing in development !
// app.use(setSessionAndCsrfToken);

// react html pages rendering
app.use(renderPages);

// Error handling middleware
app.use(async (err, req, res, next) => {
  // log error on server
  console.error(`${err.status} : `, err.message);
  try {
    const htmlData = await renderToString(err, "error", vite);
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

app.listen(port, () => {
  console.log(
    `⚡Auth-SSR ${process.env.NODE_ENV} server is running at http://127.0.0.1:${port}`
  );
});

export { app };
