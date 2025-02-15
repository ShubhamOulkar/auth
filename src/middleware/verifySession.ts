import { base64url } from "jose";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import {
  throwError,
  getCookies,
  verifySessionId,
  decryptJwtToken,
} from "../utilities/utilitiesExporter.js";
import { findCsrfHash } from "../db/dbUtils.js";
import { NextFunction, Request, RequestHandler } from "express";
import { CustomResponse } from "../type.js";
config();

const SECRET = process.env.VITE_POST_BODY_SECRET ?? "";
const secretKey = base64url.decode(SECRET);
const csrfColl = process.env.CSRF_COLLECTION ?? "";
const CSRF_SECRET = process.env.CSRF_SECRET ?? "";
const decryptOption = {
  issuer: process.env.VITE_ISSURE,
  audience: process.env.VITE_AUDIENCE,
  subject: process.env.VITE_SUBJECT,
};

// Define `verifySession` as a RequestHandler
const verifySession = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction
) => {
  try {
    let cookieCsrf: string;
    let cookieSession: string;
    // get csrf and session cookie
    const cookie = getCookies(req);

    if (cookie === false) {
      throwError("❌ csrf token and session id required");
      return;
    } else {
      cookieCsrf = cookie.cookieCsrf;
      cookieSession = cookie.cookieSession;
    }

    // Decrypt and validate token
    const decryptedToken = await decryptJwtToken(
      "form request body",
      req.body,
      secretKey,
      decryptOption
    );

    if (!decryptedToken) {
      throwError("❌ Invalid token structure", 400);
    }

    const {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      payload: {
        payload: { csrfToken, formData, googleId, userData, authKey, btnName },
      },
    } = decryptedToken;

    if (!csrfToken) {
      throwError("❌ Missing CSRF token in request", 400);
    }

    // TODO check jwt request body headers

    // verify csrf token
    // check csrfCookieHeader === csrfBody
    if (csrfToken !== cookieCsrf)
      throwError("❌ Invalid csrf token and session id");

    // check csrf token is awailable in cache memory, this function throws error if not found
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: cacheCsrfHash, jwt: cacheCsrfJwt } = await findCsrfHash(
      csrfColl,
      cookieCsrf
    );

    // verify  session id in jwtCsrf
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    jwt.verify(cacheCsrfJwt, CSRF_SECRET, (err, csrfPayload) => {
      // cached jwt csrf invalid error
      if (err) throwError(err.name);

      //check session id is present in csrf payload
      if (csrfPayload.sessionId !== cookieSession)
        throwError(
          "❌ confirmed client attack on server: invalid csrf token for given session id. ❌"
        );

      // verify session id
      verifySessionId(cookieSession, csrfPayload.sessionId)
        .then((res) =>
          console.log("✔️ Session id verified successfully : ", res)
        )
        .catch((err: { message: string }) => {
          throwError(err.message);
        });
    });

    // set formData/googleId local variable on current request (variable only available for current request/response cycle)
    res.locals.formData = formData; // data from login/signup/2fa post request otherwise undefined
    res.locals.googleId = googleId; // googleId from login with google provider otherwise undefined
    res.locals.userData = userData;
    res.locals.authKey = authKey;
    res.locals.csrfToken = csrfToken;
    res.locals.btnName = btnName;
    next();
  } catch (err) {
    next(err);
  }
};

export default verifySession as RequestHandler;
