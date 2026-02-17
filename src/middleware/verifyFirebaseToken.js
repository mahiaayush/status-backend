const admin = require("../config/firebase");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
