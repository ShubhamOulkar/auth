import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import React from "react";
import AuthProvider from "./auth context/AuthProvider";
import NotificationProvider from "./notification context/NotificationContextProvider";

hydrateRoot(
  document.getElementById("root") as HTMLDivElement,
  <StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <App />
        </BrowserRouter>
      </AuthProvider>
    </NotificationProvider>
  </StrictMode>
);
