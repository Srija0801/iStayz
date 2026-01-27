const express = require("express");
const {
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
  updatePaymentStatus,
  deletePayment,
} = require("../controllers/adminController");
const { protect, adminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Protect routes and only allow admin

// Stats
router.get("/stats", protect, adminAuth, getAdminStats);

// Users
router.get("/users", protect, adminAuth, getAllUsers);
router.put("/users/:id", protect, adminAuth, updateUser);
router.delete("/users/:id", protect, adminAuth, deleteUser);

// Bookings
router.get("/bookings", protect, adminAuth, getAllBookings);
router.put("/bookings/:id", protect, adminAuth, updateBooking);
router.delete("/bookings/:id", protect, adminAuth, deleteBooking);

// Reviews
router.get("/reviews", protect, adminAuth, getAllReviews);
router.put("/reviews/:id", protect, adminAuth, updateReview);
router.delete("/reviews/:id", protect, adminAuth, deleteReview);

//payment
router.get("/payments", getAllPayments);

router.delete("/payments/:id", deletePayment);

module.exports = router;
