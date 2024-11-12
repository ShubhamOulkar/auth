import React from "react";
import { Router } from "./routes/browserRoutes";

// Works also with SSR as expected
//const Card = lazy(() => import("./Card"));

function App() {
  return (
    <div>
      <Router />
    </div>
  );
}

export default App;
