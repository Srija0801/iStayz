const express = require("express");

const { loginUser, registerUser } = require("../controllers/authController");

const routes = express.Router();

//routes
routes.post("/register", registerUser);
routes.post("/login", loginUser);

module.exports = routes;
