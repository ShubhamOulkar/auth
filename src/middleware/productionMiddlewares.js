import { Router } from "express";
import { staticFilesRouter } from "./serverMutipleStaticDirectories.js";
const compression = (await import("compression")).default;
import setSessionAndCsrfToken from "./setSessionAndCsrfToken.js";
import clientHttpValidation from "./clientHttpValidation.js";
const productionMiddlewares = Router();

productionMiddlewares.use(
  staticFilesRouter,
  compression(),
  setSessionAndCsrfToken,
  clientHttpValidation("dist/client")
);

export { productionMiddlewares };
