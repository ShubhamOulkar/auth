import { StrictMode, lazy } from "react";
import { hydrateRoot } from "react-dom/client";
import Home from "../../client_store/pages/Home";
import AllContextProvider from "../../client_store/context/AllContextProvider";
const ProjectInfoPage = lazy(
  () => import("../../client_store/pages/ProjectInfoPage")
);

hydrateRoot(
  document.getElementById("root") as HTMLDivElement,
  <StrictMode>
    <AllContextProvider>
      <Home Outlet={<ProjectInfoPage />} />
    </AllContextProvider>
  </StrictMode>
);
