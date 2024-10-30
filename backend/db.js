const mysql=require("mysql2");
const dotenv=require("dotenv");
dotenv.config();


// database connection
const db= mysql.createConnection({
    host: process.env.DB_HOST,      
    user: process.env.DB_USER,     
    password: process.env.DB_PASS,
    database: process.env.DB_NAME

})
db.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err);
      return;
    }
    console.log("Connected to the database.");
  });
  
  module.exports = db; // Export the database connection