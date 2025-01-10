import ReactComponentName from "react-scan/react-component-name/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ["VITE_"],
  plugins: [ReactComponentName({}), svgr(), react()],
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
      input: {
        // build multiple page application
        main: resolve(__dirname, "index.html"),
        conf: resolve(__dirname, "pages/conf/index.html"),
      },
    },
  },
});
