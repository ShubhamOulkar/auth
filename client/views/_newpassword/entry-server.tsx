import React, { StrictMode, lazy } from "react";
import { prerenderToNodeStream, PrerenderOptions } from "react-dom/static";
import AllContextProvider from "../../client_store/context/AllContextProvider";
const SetNewPassword = lazy(
  () => import("../../client_store/pages/SetNewPassword")
);

/**
 * @param {string} url
 * @param {string} [ssrManifest]
 * @param {import('react-dom/server').RenderToPipeableStreamOptions} [options]
 */

export function render(options?: PrerenderOptions) {
  return prerenderToNodeStream(
    <StrictMode>
      <AllContextProvider>
        <div className="home">
          <SetNewPassword />
        </div>
      </AllContextProvider>
    </StrictMode>,
    options
  );
}

// export function render(_url: string, options?: RenderToPipeableStreamOptions) {
//   return renderToPipeableStream(
//     <StrictMode>
//       <AllContextProvider>
//         <div className="home">
//           <SetNewPassword />
//         </div>
//       </AllContextProvider>
//     </StrictMode>,
//     options
//   );
// }
