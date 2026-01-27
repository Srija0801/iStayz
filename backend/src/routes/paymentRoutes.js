const express = require("express");
const {
  createOrder,
  verifyPayment,
  razorKEY,
  sendPaymentOtp,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/get-RAZORKEY", razorKEY);
router.post("/verify-payment-otp", sendPaymentOtp);
module.exports = router;
