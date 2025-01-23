import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { PictureProvider } from "./picture context/createPictureContext";
import { reportRecoverableError } from "./reportError";

const rootEle = document.getElementById("root") as HTMLDivElement;

hydrateRoot(
  rootEle,
  <StrictMode>
    <PictureProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PictureProvider>
  </StrictMode>,
  {
    onRecoverableError: (error, errorInfo) => {
      reportRecoverableError({
        error,
        cause: (error as any).cause,
        componentStack: errorInfo.componentStack,
      });
    },
  }
);
