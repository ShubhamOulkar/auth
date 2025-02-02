import express from "express";
import cors from "cors";
import crypto from "crypto";
import morgan from "morgan";
import { config } from "dotenv";
import { connectMongo } from "./db/dbUtils.ts";
import {
  auth,
  googleAuth,
  twoFa,
  renderPages,
} from "./routes/routesExporter.js";
import { productionMiddlewares } from "./middleware/productionMiddlewares.js";
import setSessionAndCsrfToken from "./middleware/setSessionAndCsrfToken.js";
import errorHandler from "./middleware/errorHandler.js";
config();

const generateNonce = () => {
  return crypto.hash("sha256", crypto.randomBytes(16).toString("base64"));
};
const port = process.env.PORT || 5500;
const isProduction = process.env.NODE_ENV === "production";
const ABORT_DELAY = 10000; //10 sec

// http server applicaton
const app = express();

// cross platform settings
const corsOptions = {
  origin: " http://127.0.0.1:5500", // Allow requests from specific origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Set-Cookie",
    "X-CSRF-Token",
  ],
  credentials: true,
  maxAge: 3600, // Specify maximum age of CORS configuration
};

// connect to mongoDB instance
await connectMongo();

// middlewares
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.raw({ type: "text/plain" }));
// Debug middleware
// app.use((req, res, next) => {
//   console.log("Content-Type:", req.get("Content-Type"));
//   console.log("Body:", req.body);
//   next();
// });
// basic security CSP middleware
app.use((req, res, next) => {
  const nonce = generateNonce();
  res.locals.nonce = nonce;
  res.setHeader(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}';`
  );
  next();
});

// Add request timeout middleware
// app.use((req, res, next) => {
//   const timeout = setTimeout(() => {
//     res.status(408);
//     res.send(`Request Timeout ${ABORT_DELAY}ms for ${req.originalUrl}`);
//   }, ABORT_DELAY);

//   res.on("finish", () => clearTimeout(timeout));
//   next();
// });
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

if (!isProduction) {
  // set cookie for session ID and csrf token on page load
  app.use(setSessionAndCsrfToken);
}

app.use(errorHandler);

// react html pages rendering
app.use(renderPages);

app.listen(port, () => {
  console.log(
    `⚡Auth-SSR ${process.env.NODE_ENV} server is running at http://127.0.0.1:${port}`
  );
});

export { app };
