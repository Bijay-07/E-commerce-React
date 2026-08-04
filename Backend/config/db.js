const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.error("Database connection failed:", err.message);
      process.exit(1);
    });
};

module.exports = connectDB;