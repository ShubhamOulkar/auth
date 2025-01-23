import { CLientErrorType } from "../types/notificationType";

export function returnError(message: string): CLientErrorType {
  return {
    success: false,
    err_msg: message,
  };
}

export default function getCookie(cookieName: string) {
  // Check if cookieName is empty
  if (!cookieName) {
    return returnError("Cookie name cannot be empty");
  }

  // Check if cookies exist
  const cookies = document.cookie;
  if (!cookies) {
    return returnError("refresh the page to set new session.");
  }

  const result = cookies
    .split(";")
    .filter((c) => c.includes(cookieName + "="))[0]
    ?.replace(cookieName + "=", "")
    .trim();

  if (!result) {
    return returnError(`Auth  ${cookieName} not found.`);
  }

  // Return cookie value or error
  return result;
}
