import { config } from "dotenv";
config();

function getCookies(req) {
  let cookie = req.headers["cookie"];

  if (!cookie) {
    console.log("session/csrf cookie is not pressent");
    return false;
  }

  const arr = cookie.split(`${process.env.VITE_CSRF_COOKIE_NAME}=`);

  // if session or csrf cookie is not available or invalid cookie
  if (!arr[0] || !arr[1]) {
    console.log("invalid cookie:", arr);
    return false;
  }

  const cookieCsrf = arr[1].trim();

  const cookieSession = arr[0]
    .split(`${process.env.SESSION_COOKIE_NAME}=`)[1]
    .replace(";", "")
    .trim();

  return { cookieCsrf, cookieSession };
}

export default getCookies;
