import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ["VITE_"],
  plugins: [svgr(), react()],
  html: {
    cspNonce: "nonce-value", // add nonce placeholder on scripts, links headers tags
  },
  build: {
    rollupOptions: {
      treeshake: true,
      input: {
        //build multiple page application
        root: "./client/views/root/root.html",
        login: "./client/views/login/login.html",
        signup: "./client/views/signup/signup.html",
        forgot: "./client/views/forgotpassword/forgotpassword.html",
        profile: "./client/views/profile/profile.html",
      },
    },
  },
});
