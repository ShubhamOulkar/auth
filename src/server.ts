import express from "express";
import cors from "cors";
import crypto from "crypto";
import morgan from "morgan";
import { config } from "dotenv";
import { connectMongo } from "./db/dbUtils.js";
import {
  auth,
  googleAuth,
  twoFa,
  renderPages,
} from "./routes/routesExporter.js";
import { productionMiddlewares } from "./middleware/productionMiddlewares.js";
import setSessionAndCsrfToken from "./middleware/setSessionAndCsrfToken.js";
import { Express } from "express";
config();

const generateNonce = () => {
  return crypto.hash("sha256", crypto.randomBytes(16).toString("base64"));
};
const port = process.env.PORT ?? 5500;
const isProduction = process.env.NODE_ENV === "production";

// http server applicaton
const app: Express = express();

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

// production middlewares
if (isProduction) {
  app.use(productionMiddlewares);
} else {
  app.use(setSessionAndCsrfToken);
}

// basic security CSP middleware
app.use((_req, res, next) => {
  const nonce = generateNonce();
  res.locals.nonce = nonce;
  res.setHeader(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}';`
  );
  next();
});

// authontication and authorization routes
app.use("/auth", auth);
// authenticate by google indentity route
app.use("/google", googleAuth);
// two factor authentication routes
app.use("/2fa", twoFa);

// react html pages rendering
app.use(renderPages);

app.listen(port, () => {
  console.log(
    `⚡Auth-SSR ${process.env.NODE_ENV} server is running at http://127.0.0.1:${port}`
  );
});

export { app };
