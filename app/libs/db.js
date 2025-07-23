const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

var connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  timezone: dbConfig.timezone,
});

connection.getConnection((err, conn) => {
  if (err) {
    ("Database connection failed:", err);
    return;
  }
  console.log("Database connected successfully!");
  conn.release(); 
});

module.exports = connection;