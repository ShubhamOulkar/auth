import { hydrateRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./App";
const root = document.getElementById("root") as HTMLElement;

hydrateRoot(
  root,
  <StrictMode>
    <App />
  </StrictMode>
);
