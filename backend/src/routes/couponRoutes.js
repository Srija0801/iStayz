const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getAllCouponsForUsers,
} = require("../controllers/couponController");
const { protect, adminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/public", getAllCouponsForUsers);

// Admin routes
router.post("/", protect, adminAuth, createCoupon);
router.get("/", protect, adminAuth, getAllCoupons);
router.get("/:id", protect, adminAuth, getCouponById);
router.put("/:id", protect, adminAuth, updateCoupon);
router.delete("/:id", protect, adminAuth, deleteCoupon);

module.exports = router;
