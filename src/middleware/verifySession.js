import { base64url } from "jose";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import getCookies from "../utilities/getCookies.js";
config();
import { findCsrfHash } from "../db/dbUtils.js";
import verifySessionId from "../utilities/verifySessionId.js";
import { throwError, checkKeyValues } from "../utilities/utils.js";
import decryptJwtToken from "../utilities/decryptJwtToken.js";

const SECRET = process.env.VITE_POST_BODY_SECRET;
const secretKey = base64url.decode(SECRET);
const csrfColl = process.env.CSRF_COLLECTION;
const CSRF_SECRET = process.env.CSRF_SECRET;
const decryptOption = {
  issuer: process.env.VITE_ISSURE,
  audience: process.env.VITE_AUDIENCE,
  subject: process.env.VITE_SUBJECT,
};

async function verifySession(req, res, next) {
  try {
    // get csrf and session cookie
    const cookie = getCookies(req);

    if (cookie === false) {
      throwError("❌ csrf token and session id required");
    }

    const { cookieCsrf, cookieSession } = cookie;

    // decrypt request body
    const {
      payload: {
        payload: { csrfToken, formData, googleId, userData, authKey, btnName },
      },
      protectedHeader,
    } = await decryptJwtToken(
      "form request body",
      req.body,
      secretKey,
      decryptOption
    );

    !csrfToken &&
      throwError("❌ Failed decrypting jwt request body token", 500);

    // TODO check jwt request body headers

    // verify csrf token
    // check csrfCookieHeader === csrfBody
    csrfToken !== cookieCsrf &&
      throwError("❌ Invalid csrf token and session id");

    // check csrf token is awailable in cache memory, this function throws error if not found
    let { _id: cacheCsrfHash, jwt: cacheCsrfJwt } = await findCsrfHash(
      csrfColl,
      cookieCsrf
    );

    // verify  session id in jwtCsrf payload
    jwt.verify(cacheCsrfJwt, CSRF_SECRET, (err, csrfPayload) => {
      // cached jwt csrf invalid error
      err && throwError(err.name);

      //check session id is present in csrf payload
      csrfPayload.sessionId !== cookieSession &&
        throwError(
          "❌ confirmed client attack on server: invalid csrf token for given session id. ❌"
        );

      // verify session id
      verifySessionId(cookieSession, csrfPayload.sessionId)
        .then((res) =>
          console.log("✔️ Session id verified successfully : ", res)
        )
        .catch((err) => {
          throwError(err.message);
        });
    });

    // set formData/googleId local variable on current request (variable only available for current requwst/response cycle)
    res.locals.formData = formData; // data from login/signup post request otherwise undefined
    res.locals.googleId = googleId; // googleId from login with google provider otherwise undefined
    res.locals.userData = userData;
    res.locals.authKey = authKey;
    res.locals.csrfToken = csrfToken;
    res.locals.btnName = btnName;
    next();
  } catch (err) {
    next(err);
  }
}

export default verifySession;
