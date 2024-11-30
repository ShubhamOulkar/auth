import React, { useEffect } from "react";
import { Router } from "./routes/browserRoutes";

const refreshInterval = import.meta.env.VITE_COOKIE_EXP_TIME;

function App() {
  useEffect(() => {
    const timerId = setInterval(() => {
      const exp = document.cookie.includes(
        import.meta.env.VITE_CSRF_COOKIE_NAME
      );

      if (!exp) {
        localStorage.removeItem("auth_ssr_user");
        window.location.reload();
      }
    }, refreshInterval);

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
