const mysql = require('mysql2');
require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
    {
      host: 'localhost',
    },
    console.log(`Connected to the movies_db database.`)
  );

module.exports = db;