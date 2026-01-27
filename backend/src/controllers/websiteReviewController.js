const UserReviewModel = require("../models/WebisteReviews");

const getReviews = async (req, res) => {
  try {
    const reviews = await UserReviewModel.find({});
    if (reviews) {
      res.status(200).json({
        success: true,
        totalReviews: reviews.length,
        reviews,
      });
    } else {
      res.status(402).json({ message: "No reviews to view" });
    }
  } catch (error) {
    res.status(200).json({
      message: "Unable to fetch the reviews from backend",
    });
  }
};

const setReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const userId = req.user?._id || req.body.createdBy;

    if (!comment || !rating) {
      return res
        .status(400)
        .json({ message: "Comment and rating are required" });
    }

    const newReview = new UserReviewModel({
      comment,
      rating,
      createdBy: userId,
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to submit review",
    });
  }
};

module.exports = { getReviews, setReview };
