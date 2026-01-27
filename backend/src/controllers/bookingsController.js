const Booking = require("../models/Bookings");
const User = require("../models/User");

// Create a booking
const createBooking = async (req, res) => {
  try {
    const { userId, hotel, checkIn, checkOut, adults, totalPrice } = req.body;

    if (!userId || !hotel || !checkIn || !checkOut || !adults || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const booking = await Booking.create({
      user: userId,
      hotel,
      checkIn,
      checkOut,
      adults,
      totalPrice,
    });

    return res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get bookings of a user
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ user: userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    return res.status(200).json({ success: true, message: "Booking deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createBooking, getUserBookings, deleteBooking };
