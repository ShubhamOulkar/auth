import { rateLimit } from "express-rate-limit";

// set up rate limiter: maximum of five requests per minute
export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 10, // Limit each IP to 5 requests per `window` (here, per 1 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    success: false,
    msg: "Too many requests, please try again later.",
    code: 429,
  },
});

export const newPasslimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 1, // Limit each IP to 5 requests per `window` (here, per 1 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    success: false,
    msg: "Too many requests, please try again later.",
    code: 429,
  },
});

// set up rate limiter: maximum of five requests per minute
export const limiter2Fa = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 3, // Limit each IP to 3 requests per `window` (here, per 1 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    success: false,
    msg: "Too many requests, please try again later.",
    code: 429,
  },
});

export const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 1,
  message: {
    success: false,
    msg: "Too many requests, please try again later.",
  },
});
