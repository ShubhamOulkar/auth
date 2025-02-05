import { createServer, ViteDevServer } from "vite";
const viteDevServer: ViteDevServer = await createServer({
  server: {
    middlewareMode: true,
  },
  appType: "custom",
});

export default viteDevServer;
