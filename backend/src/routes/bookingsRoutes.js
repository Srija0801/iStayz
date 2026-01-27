const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  deleteBooking,
} = require("../controllers/bookingsController");

router.post("/create", createBooking);

router.get("/user/:userId", getUserBookings);

router.delete("/:id", deleteBooking);

module.exports = router;
