import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import React from "react";
import AllContextProvider from "./context/AllContextProvider";

hydrateRoot(
  document.getElementById("root") as HTMLDivElement,
  <StrictMode>
    <AllContextProvider>
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <App />
      </BrowserRouter>
    </AllContextProvider>
  </StrictMode>
);
