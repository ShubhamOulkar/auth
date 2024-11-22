function sendTokenToServer(response: { credential: any }) {
  // split the string at csrf token and get csrf token from 1st index in an array
  // this code works in devlopment and production
  // in devlopment vite add some non httponly cookies so to eliminate these cookies
  // following line of code is easiest to do it.
  const csrfToken = document.cookie.split("Auth_csrf_token=")[1];

  fetch("http://127.0.0.1:5500/google/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      googleId: response.credential,
      csrfToken,
    }),
    credentials: "same-origin",
  })
    .then((res) => console.log("google verified:", res))
    .catch((err) => console.log("error in google verification:", err));
}

export default sendTokenToServer;
