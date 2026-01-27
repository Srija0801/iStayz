const express = require("express");
const routes = express.Router();
const getCityPhotos = require("../controllers/cityPhotosController");

routes.get("/:city", getCityPhotos);

module.exports = routes;
