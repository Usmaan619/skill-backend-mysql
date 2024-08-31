require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  // host: process.env.DB_HOST,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL");
    return connection;
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };
