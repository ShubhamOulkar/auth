import { config } from "dotenv";
config();

function getCookies(string) {
  const arr = string.split(`${process.env.CSRF_COOKIE_NAME}=`);
  const cookieCsrf = arr[1].trim();
  const cookieSession = arr[0]
    .split(`${process.env.SESSION_COOKIE_NAME}=`)[1]
    .replace(";", "")
    .trim();
  return { cookieCsrf, cookieSession };
}

export default getCookies;
