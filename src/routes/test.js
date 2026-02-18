const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  res.send("Test Route Working ✅");
});

router.get('/otp', (req, res) => {
  res.sendFile(path.join(__dirname, '../../test-otp.html'));
});

module.exports = router;