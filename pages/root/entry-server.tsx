import React from "react";
import { StrictMode } from "react";
import {
  renderToPipeableStream,
  RenderToPipeableStreamOptions,
} from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import AllContextProvider from "./context/AllContextProvider";

/**
 * @param {string} url
 * @param {string} [ssrManifest]
 * @param {import('react-dom/server').RenderToPipeableStreamOptions} [options]
 */

export function render(
  _url: string,
  _ssrManifest?: string,
  options?: RenderToPipeableStreamOptions
) {
  return renderToPipeableStream(
    <StrictMode>
      <AllContextProvider>
        <StaticRouter location={_url}>
          <App />
        </StaticRouter>
      </AllContextProvider>
    </StrictMode>,
    options
  );
}
