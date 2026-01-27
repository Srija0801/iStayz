const express = require("express");
const { getHotels } = require("../controllers/hotelController");
const router = express.Router();

router.get("/search", getHotels);

module.exports = router;
