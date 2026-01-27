const transporter = require("../config/emailConfig");
const generateOtp = require("../utils/generateOtp");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

global.otpStore = {}; // { email: { otp, expiresAt } }

// SEND OTP
const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  global.otpStore[email] = { otp, expiresAt };

  const mailOptions = {
    from: `"iStayZ Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your iStayZ Password - OTP Inside",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #1a73e8; margin-bottom: 0;">iStayZ Password Reset</h2>
      <p style="margin-top: 4px;">Hello,</p>
      <p>We received a request to reset your iStayZ account password. Use the OTP below to proceed. This OTP is valid for <strong>5 minutes</strong>.</p>

      <div style="
        display: inline-block;
        background-color: #1a73e8;
        color: #fff;
        font-size: 28px;
        font-weight: bold;
        padding: 12px 24px;
        border-radius: 6px;
        letter-spacing: 2px;
        margin: 20px 0;
      ">
        ${otp}
      </div>

      <p>If you did not request this password reset, please ignore this email or contact our support immediately.</p>
      <p>Thank you,<br/><strong>iStayZ Support Team</strong></p>

      <hr style="border: none; border-top: 1px solid #ddd; margin-top: 30px;"/>
      <p style="font-size: 12px; color: #777;">This is an automated message. Please do not reply to this email.</p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// VERIFY OTP
const verifyOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "All fields are required" });

  const otpData = global.otpStore[email];
  if (!otpData || Date.now() > otpData.expiresAt)
    return res.status(400).json({ message: "OTP expired or invalid" });

  if (otpData.otp.toString() !== otp.toString())
    return res.status(400).json({ message: "Invalid OTP" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = newPassword;
  await user.save();

  delete global.otpStore[email];

  res.status(200).json({ message: "Password reset successfully" });
};

module.exports = { sendOtp, verifyOtp };
