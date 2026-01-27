const User = require("../models/User");
const Booking = require("../models/Bookings");
const Review = require("../models/WebisteReviews");
const Payment = require("../models/Payment"); // 🧾 import Payment model

// 1️⃣ Admin Stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalPayments = await Payment.countDocuments();

    const totalRevenueAgg = await Booking.aggregate([
      { $match: { totalPrice: { $exists: true } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);

    const totalRevenue =
      totalRevenueAgg.length > 0 ? totalRevenueAgg[0].totalRevenue : 0;

    res.json({
      totalUsers,
      totalBookings,
      totalReviews,
      totalPayments,
      totalRevenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// 2️⃣ User Management
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.fullName = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 3️⃣ Booking Management
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "fullName email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    Object.assign(booking, req.body);
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 4️⃣ Review Management
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("createdBy", "fullName email")
      .lean();

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    Object.assign(review, req.body);
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 5️⃣ Payment Management 🧾
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await payment.deleteOne();
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error("Error deleting payment:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Export all controllers
module.exports = {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllBookings,
  updateBooking,
  deleteBooking,
  getAllReviews,
  updateReview,
  deleteReview,
  getAllPayments,

  deletePayment,
};
