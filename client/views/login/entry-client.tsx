import { StrictMode, lazy } from "react";
import { hydrateRoot } from "react-dom/client";
import AllContextProvider from "../../client_store/context/AllContextProvider";
const LoginPage = lazy(() => import("../../client_store/pages/LoginPage"));
import Home from "../../client_store/pages/Home";

hydrateRoot(
  document.getElementById("root") as HTMLDivElement,
  <StrictMode>
    <AllContextProvider>
      <Home Outlet={<LoginPage />} />
    </AllContextProvider>
  </StrictMode>
);
