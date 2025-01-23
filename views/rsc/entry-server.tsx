import {
  renderToPipeableStream,
  RenderToPipeableStreamOptions,
} from "react-dom/server";
import { App } from "./App";
import { StrictMode } from "react";

export function render(_url: string, options?: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(
    <StrictMode>
      <App />
    </StrictMode>,
    options
  );
}
