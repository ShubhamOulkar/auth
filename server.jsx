import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "./views/createEmotionCache";

import express from "express";
import fs from "node:fs/promises";
// import cors from "cors";
import morgan from "morgan";
import { configDotenv } from "dotenv";
configDotenv();

import React from "react";
import ReactDOMServer from "react-dom/server";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import christmasTheme from "./views/themes/christmasTheme";
import { CacheProvider } from "@emotion/react";
import App from "./views/client/components/App";

// import auth from "./src/routes/auth";
// import { connectMongo } from "./src/db/dbUtils";
// import errorHandler from "./src/middleware/errorHandler";
import path from "node:path";

const port = process.env.PORT;
const app = express();

// const corsOptions = {
//   origin: "http://localhost:5173", // Allow requests from specific origin
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "Cache-Control",
//     "Set-Cookie",
//   ],
//   credentials: true,
//   maxAge: 3600, // Specify maximum age of CORS configuration
// };
// connectMongo();

const renderReactApp = async (req, res) => {
  const emotionCache = createEmotionCache();
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(emotionCache);

  const reactHtml = ReactDOMServer.renderToString(
    <React.StrictMode>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={christmasTheme}>
          <CssBaseline />
          <h1>This page is rendered by SSR. By dev Shubham </h1>
          <App />
        </ThemeProvider>
      </CacheProvider>
    </React.StrictMode>
  );

  const emotionChunks = extractCriticalToChunks(reactHtml);
  const emotionCss = constructStyleTagsFromChunks(emotionChunks);
  // Add css and HTML to template file
  const indexHtml = await fs.readFile(
    `${path.resolve("dist")}/index.html`,
    "utf-8"
  );

  const renderedApp = indexHtml
    .replace("<style></style>", emotionCss)
    .replace('<div id="root"></div>', `<div id="root">${reactHtml}</div>`);

  res.status(200).send(renderedApp);
};

app.use("/static", express.static(path.resolve("dist")));
app.use(morgan("tiny"));
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use("/auth", auth);
// app.use(errorHandler);

// Create GET request
app.get("/", renderReactApp);

app.listen(port, () => {
  console.log(`auth server is running at http://localhost:${port}`);
});

export { app };
