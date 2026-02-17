const express = require("express");
const connectDB = require("./config/mongo");

const authRoutes = require("./routes/auth");
const statusRoutes = require("./routes/status");
const testPage  = require("./routes/testPage");

const app = express();

app.use(express.json());

connectDB();

app.use("/auth", authRoutes);
app.use("/status", statusRoutes);
app.use("/dev/test", testPage);
module.exports = app;
