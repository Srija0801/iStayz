const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hotel: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      city: { type: String, required: true },
      description: { type: String },
      image: { type: String },
      price: { type: Number },
      rating: { type: Number },
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    adults: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
