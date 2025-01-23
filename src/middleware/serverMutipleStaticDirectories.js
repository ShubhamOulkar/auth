import { Router } from "express";
import path from "path";
const sirv = (await import("sirv")).default;
const staticFilesRouter = Router();

// Configure static file serving
const staticOptions = {
  dev: false, // production only
  extensions: [],
  etag: true,
  maxAge: 31536000, // 1 year
  immutable: true,
  gzip: true,
};

staticFilesRouter.use(sirv(path.resolve("./dist/client"), staticOptions));

staticFilesRouter.use(sirv(path.resolve("./dist/server/error"), staticOptions));

export { staticFilesRouter };

// Helper to serve from multiple directories
// const serveStatic = (directories) => {
//   return (req, res, next) => {
//     const tryNext = (i = 0) => {
//       if (i >= directories.length) {
//         return next();
//       }
//       const handler = sirv(directories[i], staticOptions);
//       handler(req, res, (err) => {
//         if (err) return next(err);
//         tryNext(i + 1);
//       });
//     };
//     tryNext();
//   };
// };

// Serve static files from multiple directories
// staticFilesRouter.use(
//   serveStatic([
//     "./dist/client", // SSR client assets
//     "./dist/server/error", // Error page assets
//   ])
// );
