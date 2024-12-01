import { config } from "dotenv";
config();

// this function explicitly return false on error
// because error handling is done in middleware functions
const csrfCookieName = process.env.VITE_CSRF_COOKIE_NAME;
const sessionCookieName = process.env.SESSION_COOKIE_NAME;

function getCookies(req) {
  let cookie = req.headers["cookie"];

  // cookie is not present
  if (!cookie) {
    console.log("session/csrf cookie is not pressent");
    return false;
  }

  // get cookies array
  const cookieAarr = cookie.split(";");

  // get csrf cookie
  const cookieCsrf = cookieAarr
    .filter((cookie) => cookie.includes(csrfCookieName))[0]
    ?.replace(`${csrfCookieName}=`, "")
    .trim();

  // if csrf cookie not present
  if (!cookieCsrf) {
    console.log("csrf cookie is not pressent");
    return false;
  }

  // get session cookie
  const cookieSession = cookieAarr
    .filter((cookie) => cookie.includes(sessionCookieName))[0]
    ?.replace(`${sessionCookieName}=`, "")
    .trim();

  // if session cookie not present
  if (!cookieSession) {
    console.log("session cookie is not pressent");
    return false;
  }

  return { cookieCsrf, cookieSession };
}

export default getCookies;
