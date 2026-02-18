const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = {
      uid: user.firebaseUid,
      userId: user._id,
      phone_number: decoded.phoneNumber,
      ...user.toObject()
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};