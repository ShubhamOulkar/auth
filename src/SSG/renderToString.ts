import getCSSFilePath from "../utilities/getCSSFilePath.js";
const isProduction = process.env.NODE_ENV === "production";
import viteDevServer from "../../viteDevServer.js";

export default async function renderToString(
  err: { message: string; statusCode: number },
  componentName: string
) {
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
      : `/client/views/${componentName}/Error.css`;

    const render = isProduction
      ? (await import(`../../dist/server/${componentName}/entry-server.js`))
          .render
      : (
          await viteDevServer.ssrLoadModule(
            `./client/views/${componentName}/entry-server.tsx`
          )
        ).render;

    // Render the component to string with error state ,status code and add css file path
    const { prelude } = cssFilePath && (await render(errorState, cssFilePath));

    if (!prelude) {
      return false;
    }

    return new Promise((resolve, reject) => {
      let data = "";
      //@ts-ignore
      prelude.on("error", (err) => {
        console.error("Stream error in error page generation on server:", err);
        reject({
          status: 500,
          message: "Error in rendering react component into HTML chunks",
        });
      });
      //@ts-ignore
      prelude.on("data", (chunk) => {
        data += chunk;
      });
      prelude.on("end", () => resolve(data));
    });
  } catch (err) {
    throw err;
  }
}
