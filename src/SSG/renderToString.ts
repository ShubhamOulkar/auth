import getCSSFilePath from "../utilities/getCSSFilePath.js";
const isProduction = process.env.NODE_ENV === "production";
import viteDevServer from "../../viteDevServer.js";
import ErrorResponse from "../errorObj/errorClass.js";
import { ErrorState } from "../type.js";

export default async function renderToString(
  err: ErrorResponse | Error,
  componentName: string
): Promise<string | ErrorState> {
  if (!err || !componentName) {
    throw new Error("Missing required parameters");
  }
  const errorState: ErrorState = {
    message: err.message,
    status: err instanceof ErrorResponse ? err.errorCode : 500,
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

  return new Promise((resolve, reject) => {
    let data = "";

    prelude.on("error", (err: unknown) => {
      console.error("Stream error in error page generation on server:", err);
      reject({
        status: 500,
        message: "Error in rendering react component into HTML chunks",
      });
    });

    prelude.on("data", (chunk: string) => {
      data += chunk;
    });
    prelude.on("end", () => resolve(data));
  });
}
