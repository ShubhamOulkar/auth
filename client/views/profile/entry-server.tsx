import { StrictMode, lazy } from "react";
import {
  renderToPipeableStream,
  RenderToPipeableStreamOptions,
} from "react-dom/server";
import AllContextProvider from "../../client_store/context/AllContextProvider";
import Home from "../../client_store/pages/Home";
const ProfilePage = lazy(() => import("../../client_store/pages/ProfilePage"));

/**
 * @param {string} url
 * @param {string} [ssrManifest]
 * @param {import('react-dom/server').RenderToPipeableStreamOptions} [options]
 */

export function render(_url: string, options?: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(
    <StrictMode>
      <AllContextProvider>
        <Home Outlet={<ProfilePage />} />
      </AllContextProvider>
    </StrictMode>,
    options
  );
}
