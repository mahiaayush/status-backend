const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  title: String,
  category: String,
  religionType: String,
  date: String,
  imageUrl: String,
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Status", statusSchema);
