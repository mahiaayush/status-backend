const mongoose = require("mongoose");

let isConnected;

const connectDB = async () => {
  if (isConnected) return;
  const MONGO_URI = `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@localhost:27017/${process.env.MONGO_DB_NAME}?authSource=admin`;
  const db = await mongoose.connect(MONGO_URI);
  isConnected = db.connections[0].readyState;
};

module.exports = connectDB;
