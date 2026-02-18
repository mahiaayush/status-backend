const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");
const verifyJWTToken = require("../middleware/verifyJWTToken");
const admin = require("../config/firebase");
const User = require("../models/User");

const router = express.Router();

const firebaseAuthBaseUrl = "https://identitytoolkit.googleapis.com/v1";

const getFirebaseApiKey = () => process.env.FIREBASE_WEB_API_KEY;

const requireFirebaseApiKey = (res) => {
  if (getFirebaseApiKey()) return true;

  res.status(500).json({
    message: "Missing FIREBASE_WEB_API_KEY env var"
  });

  return false;
};

const upsertUserFromDecodedToken = async (decodedToken) => {
  let user = await User.findOne({ firebaseUid: decodedToken.uid });

  if (!user) {
    user = await User.create({
      firebaseUid: decodedToken.uid,
      name: decodedToken.name || "",
      profilePic: decodedToken.picture || ""
    });
  }

  return user;
};

router.get("/me", verifyToken, async (req, res) => {
  const user = await upsertUserFromDecodedToken(req.user);
  res.json(user);
});

router.post("/phone/send-otp", async (req, res) => {
  try {
    if (!requireFirebaseApiKey(res)) return;
    const apiKey = getFirebaseApiKey();

    const { phoneNumber, recaptchaToken } = req.body;

    if (!phoneNumber || !recaptchaToken) {
      return res.status(400).json({
        message: "phoneNumber and recaptchaToken are required"
      });
    }

    const { data } = await axios.post(
      `${firebaseAuthBaseUrl}/accounts:sendVerificationCode?key=${apiKey}`,
      {
        phoneNumber,
        recaptchaToken
      }
    );

    return res.json({
      sessionInfo: data.sessionInfo,
      message: "OTP sent"
    });
  } catch (err) {
    const firebaseMessage = err.response?.data?.error?.message;
    return res.status(400).json({
      message: firebaseMessage || "Failed to send OTP"
    });
  }
});

router.post("/phone/verify-otp", async (req, res) => {
  try {
    if (!requireFirebaseApiKey(res)) return;
    const apiKey = getFirebaseApiKey();

    const { sessionInfo, code } = req.body;

    if (!sessionInfo || !code) {
      return res.status(400).json({
        message: "sessionInfo and code are required"
      });
    }

    const { data } = await axios.post(
      `${firebaseAuthBaseUrl}/accounts:signInWithPhoneNumber?key=${apiKey}`,
      {
        sessionInfo,
        code
      }
    );

    const decoded = await admin.auth().verifyIdToken(data.idToken);
    const user = await upsertUserFromDecodedToken(decoded);

    // Generate custom JWT token
    const customToken = jwt.sign(
      {
        userId: user._id,
        firebaseUid: user.firebaseUid,
        phoneNumber: decoded.phone_number
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: "Phone login successful",
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
      customToken,
      user
    });
  } catch (err) {
    const firebaseMessage = err.response?.data?.error?.message;
    return res.status(400).json({
      message: firebaseMessage || "Invalid OTP"
    });
  }
});

router.post("/phone/test-login", async (req, res) => {
  try {
    if (!requireFirebaseApiKey(res)) return;
    const apiKey = getFirebaseApiKey();

    const testLoginEnabled = process.env.ENABLE_TEST_PHONE_LOGIN === "true";
    if (!testLoginEnabled) {
      return res.status(403).json({
        message: "Test phone login is disabled"
      });
    }

    const allowedNumbers = (process.env.TEST_PHONE_NUMBERS || "")
      .split(",")
      .map((number) => number.trim())
      .filter(Boolean);

    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        message: "phoneNumber is required"
      });
    }

    if (!allowedNumbers.includes(phoneNumber)) {
      return res.status(403).json({
        message: "phoneNumber is not allowed for test login"
      });
    }

    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUserByPhoneNumber(phoneNumber);
    } catch {
      firebaseUser = await admin.auth().createUser({ phoneNumber });
    }

    const customToken = await admin.auth().createCustomToken(firebaseUser.uid, {
      phoneNumber,
      testLogin: true
    });

    const { data } = await axios.post(
      `${firebaseAuthBaseUrl}/accounts:signInWithCustomToken?key=${apiKey}`,
      {
        token: customToken,
        returnSecureToken: true
      }
    );

    const decoded = await admin.auth().verifyIdToken(data.idToken);
    const user = await upsertUserFromDecodedToken(decoded);

    // Generate custom JWT token
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        firebaseUid: user.firebaseUid,
        phoneNumber: firebaseUser.phoneNumber
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: "Test phone login successful",
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
      customToken: jwtToken,
      user
    });
  } catch (err) {
    const firebaseMessage = err.response?.data?.error?.message;
    return res.status(400).json({
      message: firebaseMessage || "Failed test phone login"
    });
  }
});

router.post("/phone/test-send-otp", async (req, res) => {
  try {
    if (!requireFirebaseApiKey(res)) return;
    const apiKey = getFirebaseApiKey();

    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        message: "phoneNumber is required"
      });
    }

    // Use a test reCAPTCHA token for development/testing
    const testRecaptchaToken = "test-recaptcha-token-12345";

    const { data } = await axios.post(
      `${firebaseAuthBaseUrl}/accounts:sendVerificationCode?key=${apiKey}`,
      {
        phoneNumber,
        recaptchaToken: testRecaptchaToken
      }
    );

    return res.json({
      sessionInfo: data.sessionInfo,
      message: "Test OTP sent successfully",
      phoneNumber,
      note: "This is a test endpoint - use the sessionInfo to verify OTP"
    });
  } catch (err) {
    const firebaseMessage = err.response?.data?.error?.message;
    return res.status(400).json({
      message: firebaseMessage || "Failed to send test OTP"
    });
  }
});

module.exports = router;
