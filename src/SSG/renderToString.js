import getCSSFilePath from "../utilities/getCSSFilePath.js";
const isProduction = process.env.NODE_ENV === "production";

/**
 * Renders a component to string with error handling
 * @param {ErrorState} err - ErrorState object
 * @param {string} componentName - Name of the component
 * @param {import('vite').ViteDevServer} vite - Vite dev server instance
 * @returns {Promise<string>} Rendered HTML string
 */
export default async function renderToString(err, componentName, vite) {
  try {
    if (!err || !componentName) {
      throw new Error("Missing required parameters");
    }
    const errorState = {
      message: err.message,
      status: err.statusCode,
    };

    const cssFilePath = isProduction
      ? await getCSSFilePath("error")
      : `./views/${componentName}/Error.css`;

    const render = isProduction
      ? (await import(`../../dist/server/${componentName}/entry-server.js`))
          .render
      : (await vite.ssrLoadModule(`./views/${componentName}/entry-server.tsx`))
          .render;

    // Render the component to string with error state ,status code and add css file path
    const { prelude } = cssFilePath && (await render(errorState, cssFilePath));

    if (!prelude) {
      return false;
    }

    return new Promise((resolve, reject) => {
      let data = "";

      prelude.on("error", (err) => {
        console.error("Stream error in error page generation on server:", err);
        reject({
          status: 500,
          message: "Error in rendering react component into HTML chunks",
        });
      });
      prelude.on("data", (chunk) => {
        data += chunk;
      });
      prelude.on("end", () => resolve(data));
    });
  } catch (err) {
    throw err;
  }
}
