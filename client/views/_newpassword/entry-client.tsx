import React, { StrictMode, lazy } from "react";
import { hydrateRoot } from "react-dom/client";
import AllContextProvider from "../../client_store/context/AllContextProvider";
const SetNewPassword = lazy(
  () => import("../../client_store/pages/SetNewPassword")
);

hydrateRoot(
  document.getElementById("root") as HTMLDivElement,
  <StrictMode>
    <AllContextProvider>
      <div className="home">
        <SetNewPassword />
      </div>
    </AllContextProvider>
  </StrictMode>
);
