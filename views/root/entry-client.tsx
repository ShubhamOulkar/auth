import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import AllContextProvider from "./context/AllContextProvider";

hydrateRoot(
  document.getElementById("root") as HTMLDivElement,
  <StrictMode>
    <AllContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AllContextProvider>
  </StrictMode>
);
