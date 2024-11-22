import generateCsrfToken from "../utilities/generateCsrfToken.js";
import generateSessionId from "../utilities/getSessionId.js";
import ErrorResponse from "../errorObj/errorClass.js";
import { config } from "dotenv";
config();
import { saveCsrf } from "../db/dbUtils.js";

const csrfColl = process.env.CSRF_COLLECTION;
/*
Setting session cookies

 *@ Set-Cookie: "session=session_ID; Secure; HttpOnly; Path=/; SameSite=strict;"
 *@ Set-Cookie: "csrf_token=token_value; Secure; SameSite=strict;"
 * client need csrf_token so remove HttpOnly
 *cookie send only to path => Path
 *client can not modify session id => HttpOnly
 *send cookie only HTTPS => Secure
 *stop csrf attack => SameSite="strict"
 *do not set Max-Age and Expires attributes because cookie must be stored for that session
 *do not add Domain because without domain means cookie only send to server.
 */

async function setSessionAndCsrfToken(req, res, next) {
  try {
    // generate session id
    const sessionId = await generateSessionId();
    // set cookie for session id
    res.cookie(process.env.SESSION_COOKIE_NAME, sessionId, {
      secure: true,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    });

    // generate casrf token using session id
    const { csrfHash: csrfToken, jwtCsrf } = await generateCsrfToken(sessionId);

    // store in db csrfHash=jwtCsrf
    await saveCsrf(csrfColl, csrfToken, jwtCsrf);

    // set csrf token
    res.cookie(process.env.CSRF_COOKIE_NAME, csrfToken, {
      secure: true,
      path: "/",
      sameSite: "strict",
    });

    next();
  } catch (err) {
    throw new ErrorResponse(
      "Error in setting client Session or csrf token",
      500
    );
  }
}

export default setSessionAndCsrfToken;
