import React, { useEffect } from "react";
import { Router } from "./routes/browserRoutes";

function App() {
  useEffect(() => {
    const timerId = setInterval(() => {
      const exp = document.cookie.includes(
        import.meta.env.VITE_CSRF_COOKIE_NAME
      );

      if (!exp) {
        window.location.reload();
      }
    }, 60000);

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
