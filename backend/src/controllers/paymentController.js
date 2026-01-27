const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const User = require("../models/User");
const transporter = require("../config/emailConfig");
const generateOtp = require("../utils/generateOtp");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Temporary OTP storage (could be moved to Redis)
global.paymentOtpStore = {}; // { userId: { otp, expiresAt } }

// ✅ 1. Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { amount, userId } = req.body;
    if (!amount || !userId) {
      return res.status(400).json({ message: "Missing amount or userId" });
    }

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order details
    await Payment.create({
      userId,
      orderId: order.id,
      amount,
      status: "created",
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// ✅ 2. Send OTP before payment verification
exports.sendPaymentOtp = async (req, res) => {
  try {
    const { userId, orderId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const expiresAt = Date.now() + 3 * 60 * 1000; // valid for 3 min
    global.paymentOtpStore[userId] = { otp, expiresAt, orderId };

    const mailOptions = {
      from: `"iStayZ Payments" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "iStayZ Payment Verification OTP",
      html: `
        <div style="font-family: Arial; line-height:1.6; color:#333;">
          <h2 style="color:#1a73e8;">iStayZ Payment Verification</h2>
          <p>Hello ${user.fullName || "Guest"},</p>
          <p>Use the OTP below to verify your payment. This code will expire in <b>3 minutes</b>.</p>
          <div style="
            background-color:#1a73e8;
            color:#fff;
            font-size:24px;
            font-weight:bold;
            padding:10px 20px;
            border-radius:8px;
            display:inline-block;
            margin:20px 0;
          ">
            ${otp}
          </div>
          <p>If you didn’t initiate this payment, please ignore this email.</p>
          <p>— The iStayZ Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Failed to send payment OTP" });
  }
};

// ✅ 3. Verify OTP and Razorpay signature
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      otp,
    } = req.body;

    // Step 1: Verify OTP first
    const otpData = global.paymentOtpStore[userId];
    if (!otpData || Date.now() > otpData.expiresAt)
      return res.status(400).json({ message: "OTP expired or invalid" });

    if (otpData.otp.toString() !== otp.toString())
      return res.status(400).json({ message: "Invalid OTP" });

    // Step 2: Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: "failed" }
      );
      return res
        .status(400)
        .json({ success: false, message: "Invalid Razorpay signature" });
    }

    // Step 3: Update payment record
    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "paid",
      },
      { new: true }
    );

    delete global.paymentOtpStore[userId];

    res.json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// ✅ 4. Get Razorpay key
exports.razorKEY = (req, res) => {
  try {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ message: "Failed to get Razorpay key" });
  }
};
