function returnError(message: string): Error {
  return new Error(message);
}

export default function getCookie(cookieName: string): string | Error {
  // Check if cookieName is empty
  const op = cookieName || returnError("Cookie name cannot be empty");

  // Check if cookies exist
  const cookies = document.cookie;
  const cookieError = !cookies && returnError("document.cookie is empty .");

  // Return cookie value or error
  return (
    (op instanceof Error && op) ||
    (cookieError instanceof Error && cookieError) ||
    cookies
      .split(";")
      .filter((c) => c.includes(cookieName + "="))[0]
      ?.replace(cookieName + "=", "")
      .trim() ||
    returnError(`Cookie ${cookieName} not found`)
  );
}
