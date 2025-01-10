import React, { useEffect } from "react";
import { Router } from "./routes/browserRoutes";
import { csrfCookieName } from "./env";

function App() {
  useEffect(() => {
    const timerId = setInterval(() => {
      const exp = document.cookie.includes(csrfCookieName);

      if (!exp) {
        window.location.reload();
      }
    }, 600000);

    return () => {
      clearInterval(timerId);
    };
  }, []);
  return (
    <main>
      <Router />
    </main>
  );
}

export default App;
