const mongoose = require("mongoose");

const connectionMongoDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/dicegame"),
      console.log("MongoDB connected!!");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
  }
};

module.exports = connectionMongoDB;
