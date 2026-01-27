const Coupon = require("../models/Coupons");

exports.createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon({ ...req.body, createdBy: req.user._id });
    await coupon.save();
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    res.status(200).json({ success: true, coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    res.status(200).json({ success: true, coupon });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    res
      .status(200)
      .json({ success: true, message: "Coupon deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Only active coupons that haven’t expired
exports.getAllCouponsForUsers = async (req, res) => {
  try {
    const today = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gte: today },
    });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
};
