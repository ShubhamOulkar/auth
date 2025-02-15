import generateCsrfToken from "../utilities/generateCsrfToken.js";
import generateSessionId from "../utilities/getSessionId.js";
import { config } from "dotenv";
config();
import { saveCsrf, deleteCsrfToken } from "../db/dbUtils.js";
import getCookies from "../utilities/getCookies.js";
import { base64url } from "jose";
import decryptJwtToken from "../utilities/decryptJwtToken.js";
import { CookieOptions, NextFunction, Request, Response } from "express";

const csrfColl = process.env.CSRF_COLLECTION ?? "";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "";
const cookieExpTime = process.env.VITE_COOKIE_EXP_TIME ?? "";
const sessionSecreteKey = base64url.decode(SESSION_SECRET);

const cookieOption: CookieOptions = {
  secure: true,
  path: "/",
  sameSite: "strict",
  expires: new Date(Date.now() + Number(cookieExpTime)),
  maxAge: Number(cookieExpTime),
};

const sessionDecryptOptions = {
  issuer: process.env.JWT_ISSURE,
  audience: process.env.JWT_AUDIENCE,
  subject: process.env.JWT_SUBJECT,
};

/*
Setting session cookies
? folllowing code only verifies session id and force to set new if invalid
? csrf token is not verified (only verified in post request by server) but set new on session invalid
 *@ Set-Cookie: "session=session_ID; Secure; HttpOnly; Path=/; SameSite=strict;"
 *@ Set-Cookie: "csrf_token=token_value; Secure; SameSite=strict;"
 * client need csrf_token so remove HttpOnly
 *cookie send only to path => Path
 *client can not modify session id => HttpOnly
 *send cookie only HTTPS => Secure
 *stop csrf attack => SameSite="strict"
 *set Max-Age and Expires attributes because cookie must be stored for that session
 *do not add Domain because without domain means cookie only send to server.
 */

async function setSessionAndCsrfToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cookie = getCookies(req);

    if (cookie === false) {
      // set session id
      await setSessionAndCsrf(req, res);
    } else {
      const { cookieSession } = cookie;

      // verify session id
      const result = await decryptJwtToken(
        "session id token",
        cookieSession,
        sessionSecreteKey,
        sessionDecryptOptions
      );

      if (result instanceof Error) {
        // log error on server
        console.error(
          "❌ Client sending Threat to the server: session id is not matched. ❌",
          result
        );

        //force to set new session id and csrf token
        await setSessionAndCsrf(req, res);
      }
    }
    next();
  } catch (err) {
    next(err);
  }
}

export async function setSessionAndCsrf(_req: Request, res: Response) {
  let csrfToken: string;
  let jwtCsrf: string;
  // generate session id
  const sessionId = (await generateSessionId()) ?? "";

  // generate csrf token using session id
  const token = await generateCsrfToken(sessionId);

  if (token) {
    csrfToken = token.csrfHash;
    jwtCsrf = token.jwtCsrf;
  } else {
    return;
  }

  // set cookie for session id
  // following type assersions are not type safe and prone to runtime errors
  res.cookie(process.env.SESSION_COOKIE_NAME ?? "se-co-na", sessionId, {
    ...cookieOption,
    httpOnly: true,
  });

  // set csrf token
  res.cookie(
    process.env.VITE_CSRF_COOKIE_NAME ?? "cs-co-na",
    csrfToken,
    cookieOption
  );

  console.log("Setting new session and csrf cookie");

  // store csrf and cache in memory
  await saveCsrf(csrfColl, csrfToken, jwtCsrf);

  // remove csrf token from cache after expiration
  setTimeout(async () => {
    await deleteCsrfToken(csrfColl, csrfToken);
  }, Number(cookieExpTime));
}

export default setSessionAndCsrfToken;
