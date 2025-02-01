import { StrictMode, lazy } from "react";
import {
  renderToPipeableStream,
  RenderToPipeableStreamOptions,
} from "react-dom/server";
import Home from "../../client_store/pages/Home";
const ProjectInfoPage = lazy(
  () => import("../../client_store/pages/ProjectInfoPage")
);

/**
 * @param {string} url
 * @param {string} [ssrManifest]
 * @param {import('react-dom/server').RenderToPipeableStreamOptions} [options]
 */

export function render(_url: string, options?: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(
    <StrictMode>
      <Home Outlet={<ProjectInfoPage />} />
    </StrictMode>,
    options
  );
}
