const mongoose = require("mongoose");

let isConnected;

const connectDB = async () => {
  if (isConnected) return;

  // Prefer MONGO_URI if provided (serverless.yml exposes this variable).
  let uri = process.env.MONGO_URI;

  // If MONGO_URI is not set, fall back to building from MONGO_DB_* env vars.
  if (!uri) {
    const user = process.env.MONGO_DB_USER;
    const pass = process.env.MONGO_DB_PASSWORD;
    const name = process.env.MONGO_DB_NAME || "status-app";

    if (user && pass) {
      uri = `mongodb://${user}:${pass}@localhost:27017/${name}?authSource=admin`;
    } else {
      // Local dev fallback — unauthenticated local Mongo on default port
      uri = `mongodb://localhost:27017/${name}`;
    }
  }

  const db = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  isConnected = db.connections[0].readyState;
  return isConnected;
};

module.exports = connectDB;
