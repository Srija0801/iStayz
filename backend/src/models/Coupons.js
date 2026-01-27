const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: 1,
      max: 100,
    },
    maxDiscountAmount: {
      type: Number,
      default: 0,
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming admin is a User with role admin
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
