const express = require("express");
const verifyToken = require("../config/firebase");
const User = require("../models/User");
const { connectDB } = require("../config/mongo");

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
router.get("/register", async (req, res) => {
  try {
    await connectDB();
    const { idToken, name } = JSON.parse(req.body);
    if (!idToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Firebase token required" }),
      };
    }
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User registered successfully",
        token,
        user,
      }),
    };
  } catch (err) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
});
module.exports = router;
