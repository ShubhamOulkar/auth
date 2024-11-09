import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./components/App";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import christmasTheme from "../themes/christmasTheme";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../createEmotionCache";

/**
 * The hydrateRoot method attaches React to the HTML
 * generated on the server. Hydration turns the server
 * generated HTML into a fully interactive app that runs
 * in the browser.
 */
hydrateRoot(
  document.getElementById("root"),
  <React.StrictMode>
    <CacheProvider value={emotionCache}>
      <ThemeProvider value={christmasTheme}>
        <CssBaseline />
        <h1>This page is rendered by SSR. By dev Shubham oulkar</h1>
        <App />
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);
