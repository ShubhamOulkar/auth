import React, { StrictMode } from "react";
import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
} from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import { PictureProvider } from "./picture context/createPictureContext";

export function render(
  _url: string = "",
  _ssrManifest?: string,
  options?: RenderToPipeableStreamOptions
) {
  return renderToPipeableStream(
    <StrictMode>
      <PictureProvider>
        <StaticRouter location={_url}>
          <App />
        </StaticRouter>
      </PictureProvider>
    </StrictMode>,
    options
  );
}
