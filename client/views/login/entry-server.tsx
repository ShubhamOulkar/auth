import { StrictMode, lazy } from "react";
import {
  renderToPipeableStream,
  RenderToPipeableStreamOptions,
} from "react-dom/server";
import AllContextProvider from "../../client_store/context/AllContextProvider";
const LoginPage = lazy(() => import("../../client_store/pages/LoginPage"));
import Home from "../../client_store/pages/Home";
/**
 * @param {string} url
 * @param {string} [ssrManifest]
 * @param {import('react-dom/server').RenderToPipeableStreamOptions} [options]
 */

export function render(_url: string, options?: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(
    <StrictMode>
      <AllContextProvider>
        <Home Outlet={<LoginPage />} />
      </AllContextProvider>
    </StrictMode>,
    options
  );
}
