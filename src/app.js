require("dotenv").config();
const express = require("express");
const connectDB = require("./config/mongo");

const authRoutes = require("./routes/auth");
const statusRoutes = require("./routes/status");
const testRoutes = require("./routes/test");
const app = express();

app.use(express.json());

connectDB();

app.use("/auth", authRoutes);
app.use("/status", statusRoutes);
app.use("/test", testRoutes);
module.exports = app;
