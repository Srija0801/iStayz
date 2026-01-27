const express = require("express");
const route = express.Router();
const { sendOtp, verifyOtp } = require("../controllers/otpController");

route.post("/send-otp", sendOtp);
route.post("/verify-otp", verifyOtp);

module.exports = route;
