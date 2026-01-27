const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // ✅ Send JWT
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// Register
const registerUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  if (!fullName || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const user = await User.create({
    fullName,
    email,
    password,
    role: role === "admin" ? "admin" : "user",
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // ✅ Send JWT
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

module.exports = { loginUser, registerUser };
