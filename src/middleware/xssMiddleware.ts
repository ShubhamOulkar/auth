import { Router } from "express";
import helmet from "helmet";
export const xss: Router = Router();

// prevent XSS attacks
xss.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        //@ts-ignore
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        //@ts-ignore
        styleSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        imgSrc: ["'self'", "data:", "blob:"],
        fontSrc: ["'self'", "data:"],
      },
    },
    xDownloadOptions: false,
  })
);
