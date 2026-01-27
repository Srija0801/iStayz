const express = require("express");
const routes = express.Router();
const getUserDetails = require("../controllers/userDetails");

routes.get("/user/:id", getUserDetails);

module.exports = routes;
