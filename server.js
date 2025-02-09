import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import sirv from "sirv";
import { config } from "dotenv";
import { connectMongo } from "./src/db/dbUtils.js";
import {
  clientHttpValidation,
  setSessionAndCsrfToken,
  errorHandler,
} from "./src/middleware/middlewareExpoter.js";
import {
  auth,
  googleAuth,
  twoFa,
  renderPages,
} from "./src/routes/routesExporter.js";
config();

const port = process.env.PORT || 2500;
const isProduction = process.env.NODE_ENV === "production";
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
app.use("/client2", express.static("static"));

// authontication and authorization routes
app.use("/auth", auth);
// authenticate by google indentity route
app.use("/google", googleAuth);
// two factor authentication routes
app.use("/2fa", twoFa);

if (isProduction) {
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

// react html pages rendering
app.use(renderPages);

app.listen(port, () => {
  console.log(
    `⚡Auth-SSR ${process.env.NODE_ENV} server is running at http://127.0.0.1:${port}`
  );
});
