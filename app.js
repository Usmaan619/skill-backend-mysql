require("dotenv").config();
const express = require("express");

const { connectToDatabase } = require("./app/config/db");
// import { connectToDatabase } from "./app/config/db";
const router = require("./app/src/routes/root.js");

const app = express();
app.use(express.json());

// Connect to databasep
connectToDatabase();

// Routes
app.use("/users", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
