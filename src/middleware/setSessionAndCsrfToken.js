import generateCsrfToken from "../utilities/generateCsrfToken.js";
import generateSessionId from "../utilities/getSessionId.js";
import { config } from "dotenv";
config();
import { saveCsrf, deleteCsrfToken } from "../db/dbUtils.js";
import getCookies from "../utilities/getCookies.js";
import { base64url } from "jose";
import decryptJwtToken from "../utilities/decryptJwtToken.js";

const csrfColl = process.env.CSRF_COLLECTION;
const SESSION_SECRET = process.env.SESSION_SECRET;
const cookieExpTime = process.env.VITE_COOKIE_EXP_TIME;
const sessionSecreteKey = base64url.decode(SESSION_SECRET);

const cookieOption = {
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

async function setSessionAndCsrfToken(req, res, next) {
  try {
    const cookie = getCookies(req);

    if (cookie === false) {
      // set session id
      await setSessionAndCsrf(req, res);
    } else {
      const { cookieCsrf, cookieSession } = cookie;

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

export async function setSessionAndCsrf(req, res) {
  // generate session id
  const sessionId = await generateSessionId();

  // generate csrf token using session id
  const { csrfHash: csrfToken, jwtCsrf } = await generateCsrfToken(sessionId);

  // set cookie for session id
  res.cookie(process.env.SESSION_COOKIE_NAME, sessionId, {
    ...cookieOption,
    httpOnly: true,
  });

  // set csrf token
  res.cookie(process.env.VITE_CSRF_COOKIE_NAME, csrfToken, cookieOption);

  console.log("Setting new session and csrf cookie");

  // store csrf and cache in memory
  await saveCsrf(csrfColl, csrfToken, jwtCsrf);

  // remove csrf token from cache after expiration
  setTimeout(async () => {
    await deleteCsrfToken(csrfColl, csrfToken);
  }, process.env.VITE_COOKIE_EXP_TIME);
}

export default setSessionAndCsrfToken;
