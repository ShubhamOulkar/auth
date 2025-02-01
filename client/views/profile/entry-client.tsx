import React, { StrictMode, lazy } from "react";
import { hydrateRoot } from "react-dom/client";
import AllContextProvider from "../../client_store/context/AllContextProvider";
import Home from "../../client_store/pages/Home";
const ProfilePage = lazy(() => import("../../client_store/pages/ProfilePage"));

hydrateRoot(
  document.getElementById("root") as HTMLDivElement,
  <StrictMode>
    <AllContextProvider>
      <Home Outlet={<ProfilePage />} />
    </AllContextProvider>
  </StrictMode>
);
