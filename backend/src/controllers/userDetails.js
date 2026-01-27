const User = require("../models/User");

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Server Error",
    });
  }
};

module.exports = getUserDetails;
