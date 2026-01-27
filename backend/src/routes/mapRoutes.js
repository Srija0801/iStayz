const express = require("express");
const router = express.Router();
const getAddressFromCoordinates = require("../controllers/GoogleMapController");

router.get("/geocode", getAddressFromCoordinates);

module.exports = router;
