import { StrictMode } from "react";
import {
  renderToPipeableStream,
  RenderToPipeableStreamOptions,
} from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import React from "react";
import AuthProvider from "./auth context/AuthProvider";
import NotificationProvider from "./notification context/NotificationContextProvider";

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
      <NotificationProvider>
        <AuthProvider>
          <StaticRouter location={_url}>
            <App />
          </StaticRouter>
        </AuthProvider>
      </NotificationProvider>
    </StrictMode>,
    options
  );
}
