const express = require("express");
const verifyToken = require("../middleware/verifyFirebaseToken");
const User = require("../models/User");

const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  let user = await User.findOne({ firebaseUid: req.user.uid });

  if (!user) {
    user = await User.create({
      firebaseUid: req.user.uid,
      name: req.user.name || "",
      profilePic: req.user.picture || ""
    });
  }

  res.json(user);
});

module.exports = router;
