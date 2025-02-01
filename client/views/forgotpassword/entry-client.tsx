import React, { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import AllContextProvider from "../../client_store/context/AllContextProvider";
import { BrowserRouter } from "react-router";
import Router from "./Routes";

hydrateRoot(
  document.getElementById("root") as HTMLDivElement,
  <StrictMode>
    <BrowserRouter>
      <AllContextProvider>
        <Router />
      </AllContextProvider>
    </BrowserRouter>
  </StrictMode>
);
