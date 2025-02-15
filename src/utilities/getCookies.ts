import { config } from "dotenv";
import { Request } from "express";
config();

// this function explicitly return false on error
// because error handling is done in middleware functions
const csrfCookieName = process.env.VITE_CSRF_COOKIE_NAME ?? "";
const sessionCookieName = process.env.SESSION_COOKIE_NAME ?? "";

function getCookies(req: Request) {
  const cookie = req.headers?.cookie;

  // cookie is not present
  if (!cookie) {
    console.log("session/csrf cookie is not pressent");
    return false;
  }

  // get cookies array
  const cookieAarr = cookie.split(";");

  //if env variables not set
  if (!csrfCookieName || !sessionCookieName) {
    console.error(
      "please set env variables csrfCookieName or sessionCookieName"
    );
    return false;
  }

  // get csrf cookie
  const cookieCsrf: string | undefined = cookieAarr
    .find((cookie: string) => cookie.includes(csrfCookieName))
    ?.replace(`${csrfCookieName}=`, "")
    .trim();

  // if csrf cookie not present
  if (!cookieCsrf) {
    console.error("csrf cookie is not pressent");
    return false;
  }

  // get session cookie
  const cookieSession: string | undefined = cookieAarr
    .find((cookie: string) => cookie.includes(sessionCookieName))
    ?.replace(`${sessionCookieName}=`, "")
    .trim();

  // if session cookie not present
  if (!cookieSession) {
    console.error("session cookie is not pressent");
    return false;
  }

  return { cookieCsrf, cookieSession };
}

export default getCookies;
