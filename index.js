const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const auth = require("./src/routes/auth");
const { connectMongo } = require("./src/db/dbUtils");
const errorHandler = require("./src/middleware/errorHandler");

const port = process.env.PORT;
const app = express();

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
connectMongo();

app.use(morgan("tiny"));
app.use(cors(corsOptions));
app.use(express.json());
app.use("/auth", auth);
app.use(errorHandler);

// Create GET request
app.get("/", (req, res) => {
  res.send("Auth server running on vercel. By dev Shubham oulkar");
});

app.listen(port, () => {
  console.log(`auth server is running at http://localhost:${port}`);
});

module.exports = app;
