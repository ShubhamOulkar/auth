import { Router } from "express";
import helmet from "helmet";
import crypto from "crypto";
export const xssRouter = Router();

// Add basic security
xssRouter.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});

// prevent XSS attacks
xssRouter.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        fontSrc: ["'self'", "data:"],
      },
    },
    xDownloadOptions: false,
  })
);
