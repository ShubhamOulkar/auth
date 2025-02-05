import { Router } from "express";
import { staticFilesRouter } from "./serverMutipleStaticDirectories.js";
const compression = (await import("compression")).default;
import setSessionAndCsrfToken from "./setSessionAndCsrfToken.js";
import clientHttpValidation from "./clientHttpValidation.js";
const productionMiddlewares: Router = Router();

productionMiddlewares.use(staticFilesRouter);
productionMiddlewares.use(compression());
//@ts-ignore
productionMiddlewares.use(setSessionAndCsrfToken);
productionMiddlewares.use(clientHttpValidation("dist/ssr"));

export { productionMiddlewares };
