import { Router } from "express";
import { staticFilesRouter } from "./serverMutipleStaticDirectories.js";
const compression = (await import("compression")).default;
import setSessionAndCsrfToken from "./setSessionAndCsrfToken.js";
const productionMiddlewares: Router = Router();

productionMiddlewares.use(staticFilesRouter);
productionMiddlewares.use(compression());
productionMiddlewares.use(setSessionAndCsrfToken);

export { productionMiddlewares };
