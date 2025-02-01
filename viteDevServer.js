const { createServer } = await import("vite");
const viteDevServer = await createServer({
  server: {
    middlewareMode: true,
  },
  appType: "custom",
});

export default viteDevServer;
