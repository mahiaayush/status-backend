const verifyFirebaseToken = require("./verifyFirebaseToken");
const verifyJWTToken = require("./verifyJWTToken");

module.exports = async (req, res, next) => {
  try {
    // Try JWT token first
    await verifyJWTToken(req, res, next);
  } catch (err) {
    // If JWT fails, try Firebase token
    try {
      await verifyFirebaseToken(req, res, next);
    } catch (firebaseErr) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
};