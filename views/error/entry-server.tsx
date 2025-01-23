import "./Error.css"; // add this import to emit assets on build
import { StrictMode } from "react";
import {
  renderToPipeableStream,
  RenderToPipeableStreamOptions,
  renderToString,
  ServerOptions,
} from "react-dom/server";
import { prerenderToNodeStream, PrerenderOptions } from "react-dom/static";
import Error, { ErrorState } from "./Error";

export function render(
  error: ErrorState,
  cssFilePath?: string,
  options?: PrerenderOptions
) {
  return prerenderToNodeStream(
    <StrictMode>
      <Error error={error} cssFilePath={cssFilePath} />
    </StrictMode>,
    options
  );
}
