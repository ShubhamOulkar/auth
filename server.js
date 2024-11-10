import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
config();
import auth from "./src/routes/auth.js";
import { connectMongo } from "./src/db/dbUtils.js";
import verifyToken from "./src/middleware/verifySession.js";
import errorHandler from "./src/middleware/errorHandler.js";
import compression from "compression";
import sirv from "sirv";
import { serverClient, vite } from "./src/middleware/serveReactClient.js";

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 0;

// http server applicaton
const app = express();

// cross platform settings
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from specific origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Set-Cookie",
  ],
  credentials: true,
  maxAge: 3600, // Specify maximum age of CORS configuration
};

// connect to mongoDB instance
connectMongo();

// middlewares
app.use(morgan("tiny"));
app.use(cors(corsOptions));
app.use(express.json());

// authontication and authorization routes
app.use("/auth", verifyToken, auth);
app.use(errorHandler);

// in development add vite middleware
if (!isProduction) {
  app.use(vite.middlewares);
} else {
  // compress each request in production
  app.use(compression());
  //server static assets in production
  app.use("/", sirv("./dist/client", { extensions: [] }));
}

// React component rendering client route
// serve home page
// must use *, otherwise on page refresh client sent get request to server
// and server will send http code on all request
app.use("*", serverClient);

app.listen(port, () => {
  console.log(
    `Auth-SSR ${process.env.NODE_ENV} server is running at http://localhost:${port}`
  );
});

export default app;
