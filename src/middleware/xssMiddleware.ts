import { Router } from "express";
import helmet from "helmet";
export const xss: Router = Router();

// prevent XSS attacks
xss.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        //@ts-expect-error res.locals error
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        //@ts-expect-error res.locals error
        styleSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        imgSrc: ["'self'", "data:", "blob:"],
        fontSrc: ["'self'", "data:"],
      },
    },
    xDownloadOptions: false,
  })
);
