const express = require("express");
const verifyToken = require("../middleware/verifyFirebaseToken");
const admin = require("../config/firebase");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const connectDB = require("../config/mongo");

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

// Register route (expects JSON body: { idToken, name })
router.post("/register", async (req, res) => {
  try {
    // connectDB is idempotent in this project but app.js already calls it on startup
    await connectDB();

    const { idToken, name } = req.body || {};
    if (!idToken) return res.status(400).json({ message: "Firebase token required" });

    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, phone_number } = decodedToken;

    // Check if user already exists
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        name,
        email,
        phone: phone_number,
        firebaseUid: uid,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ message: "User registered successfully", token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
