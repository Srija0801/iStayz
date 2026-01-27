const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: null },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Not set"],
      default: "Not set",
    },
    city: { type: String, default: null },
    pinCode: { type: String, default: null },
    profilePicture: {
      type: String,
      default:
        "/assets/default_profile/frontend/src/assets/default_profile/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Wishlist structure (hotelId is now an object with hotel details)
    wishlist: [
      {
        hotelId: {
          type: new mongoose.Schema({
            id: { type: String, required: true },
            name: { type: String, required: true },
            city: { type: String, required: true },
            description: { type: String, default: "" },
            image: { type: String, default: "" },
            price: { type: Number, default: 0 },
            rating: { type: Number, default: 0 },
          }),
          required: true,
        },
        city: { type: String, required: true },
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        adults: { type: Number, required: true, default: 1 },
      },
    ],

    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
