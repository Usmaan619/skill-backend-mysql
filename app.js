require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rootRoutes = require("./app/src/routes/rootRoutes.js");
const helmet = require("helmet");
const passport = require("passport");

const app = express();
app.use(helmet());

let lastCommit = "";
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
const { connectToDatabase } = require("./app/config/db");

app.use(express.json());

// Connect to databasep
// connectToDatabase();

/**
 * initializes passport authentication
 */
app.use(passport.initialize());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
// Routes
app.use("/api", rootRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
async function startServer() {
  try {
    await connectToDatabase();
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

/**
 * For non registered route
 */
app.use("/", function (req, res) {
  res.statusCode = 200;
  res.json({
    status: "success",
    data: {
      env: process.env.NODE_ENV,
      lastCommit,
    },
  });
});

require("child_process").exec("git log --oneline -1", function (err, stdout) {
  lastCommit = stdout;
});
startServer();
