import { Router } from "express";
import path from "path";
const sirv = (await import("sirv")).default;
const staticFilesRouter: Router = Router();

// Configure static file serving
const staticOptions = {
  dev: false, // production only
  extensions: [],
  etag: true,
  maxAge: 31536000, // 1 year
  immutable: true,
  gzip: true,
};

staticFilesRouter.use(sirv(path.resolve("./dist/ssr"), staticOptions));

export { staticFilesRouter };
