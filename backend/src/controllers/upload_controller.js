const User = require("../models/User");

const uploadDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update profile picture if file exists
    if (req.file && req.file.path) {
      user.profilePicture = req.file.path;
    }

    // Update other details if provided
    const { phone, gender, city, pinCode } = req.body;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (city) user.city = city;
    if (pinCode) user.pinCode = pinCode;

    await user.save();

    res.status(200).json({
      status: 1,
      message: "Details uploaded successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Uploading details failed" });
  }
};

const removePicture = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePicture = "";
    await user.save();

    res.status(200).json({ status: 1, message: "Profile picture removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, message: "Failed to remove picture" });
  }
};

const addWishlist = async (req, res) => {
  const { id, hotelId, city, checkIn, checkOut, adults } = req.body;

  if (!id || !hotelId || !city || !checkIn || !checkOut || !adults) {
    return res.status(400).json({
      message: "User ID, hotel info, and city are required",
    });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if hotel already in wishlist
    const exists = user.wishlist.some((item) => item.hotelId.id === hotelId.id);
    if (exists) {
      return res.status(400).json({ message: "Hotel already in wishlist" });
    }

    // Push full hotel object
    user.wishlist.push({ hotelId, city, checkIn, checkOut, adults });
    await user.save();

    res.status(200).json({ message: "Successfully added to wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

// ✅ Fix checkWishlist & removeWishlist to compare hotelId.id
const checkWishlist = async (req, res) => {
  const { id, hotel_id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.wishlist.some((item) => item.hotelId.id === hotel_id); // FIXED
    res.status(200).json({ exists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error checking wishlist" });
  }
};

const removeWishlist = async (req, res) => {
  const { id, hotel_id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter(
      (item) => item.hotelId.id !== hotel_id
    ); // FIXED
    await user.save();
    res.status(200).json({ message: "Hotel removed from wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing from wishlist" });
  }
};

module.exports = {
  uploadDetails,
  removePicture,
  addWishlist,
  checkWishlist,
  removeWishlist,
};
