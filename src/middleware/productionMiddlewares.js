import { Router } from "express";
import { xssRouter } from "./xssMiddleware.js";
import { staticFilesRouter } from "./serverMutipleStaticDirectories.js";
const compression = (await import("compression")).default;
import setSessionAndCsrfToken from "./setSessionAndCsrfToken.js";
import clientHttpValidation from "./clientHttpValidation.js";
const productionMiddlewares = Router();

productionMiddlewares.use(
  xssRouter,
  staticFilesRouter,
  compression(),
  setSessionAndCsrfToken,
  clientHttpValidation("dist/client")
);

export { productionMiddlewares };
