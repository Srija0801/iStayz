const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const hotelRoutes = require("./routes/hotelRoutes");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const userDetailsRoutes = require("./routes/userDetails");
const websiteReviewRoutes = require("./routes/websiteReviewRoutes");
const otpRoutes = require("./routes/otpRoutes");
const uploadRoutes = require("./routes/upload_details");
const cityPhotosRoutes = require("./routes/cityPhotosRoutes");
const locationRoutes = require("./routes/mapRoutes");
const bookingRoutes = require("./routes/bookingsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const couponRoutes = require("./routes/couponRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", userDetailsRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/auth", authRoutes, otpRoutes);
app.use("/api/users", userRoutes);
app.use("/api/websiteReviews", websiteReviewRoutes);
app.use("/api/user", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/city/photos", cityPhotosRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin/coupons", couponRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/help", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT || 5000, () => {
  console.log(`Successfully connected to the PORT ${PORT}`);
});
