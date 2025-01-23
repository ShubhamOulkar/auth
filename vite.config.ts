import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ["VITE_"],
  plugins: [svgr(), react()],
  server: {
    headers: {
      "Strict-Transport-Security": "max-age=86400; includeSubDomains", // Adds HSTS options to your website, with a expiry time of 1 day
      "X-Content-Type-Options": "nosniff", // Protects from improper scripts runnings
      "X-Frame-Options": "DENY", // Stops your site being used as an iframe
      "X-XSS-Protection": "1; mode=block", // Gives XSS protection to legacy browsers
    },
  },
  build: {
    rollupOptions: {
      treeshake: true,
      input: {
        // build multiple page application
        root: "./views/root/root.html",
        conf: "./views/conf/conf.html",
        rsc: "./views/rsc/rsc.html",
      },
    },
    // manifest: true, // client asset mapping
    // ssrManifest: true, // server asset mapping
    // minify: "esbuild", // minify using esbuild
    //minify: false, // disable minification in SSR, as it's done by the server
  },
});
