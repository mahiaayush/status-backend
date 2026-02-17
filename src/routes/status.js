const express = require("express");
const Status = require("../models/Status");

const router = express.Router();

router.get("/today", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const status = await Status.findOne({
    date: today,
    isActive: true
  });

  res.json(status);
});

router.get("/category/:type", async (req, res) => {
  const statuses = await Status.find({
    category: req.params.type,
    isActive: true
  });

  res.json(statuses);
});

module.exports = router;
