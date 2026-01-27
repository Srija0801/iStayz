const express = require("express");
const routes = express.Router();
const {
  getReviews,
  setReview,
} = require("../controllers/websiteReviewController");

routes.get("/getReviews", getReviews);
routes.post("/setReview", setReview);

module.exports = routes;
