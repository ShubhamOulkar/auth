import React, { StrictMode } from "react";
import {
  renderToPipeableStream,
  RenderToPipeableStreamOptions,
} from "react-dom/server";
import AllContextProvider from "../../client_store/context/AllContextProvider";
import { StaticRouter } from "react-router";
import Router from "./Routes";

/**
 * @param {string} url
 * @param {string} [ssrManifest]
 * @param {import('react-dom/server').RenderToPipeableStreamOptions} [options]
 */

export function render(_url: string, options?: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(
    <StrictMode>
      <StaticRouter location={`/${_url}`}>
        <AllContextProvider>
          <Router />
        </AllContextProvider>
      </StaticRouter>
    </StrictMode>,
    options
  );
}
