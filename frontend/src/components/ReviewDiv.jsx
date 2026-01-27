import React, { useState } from "react";
import { X, Star } from "lucide-react";
import "../styles/ReviewDiv.css";
import { toast } from "react-toastify";
import { setReview } from "../api/websiteReviewsApi";

export default function ReviewDiv({ setReviewDiv, onReviewPosted }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const storedData = JSON.parse(localStorage.getItem("user"));

  const reviewSubmitHandler = async (e) => {
    if (!rating) {
      toast.warn("Forgot to Rate");
      return;
    }

    if (!reviewText.trim()) {
      toast.warn("Please write a review");
      return;
    }

    try {
      const response = await setReview(reviewText, rating, storedData?._id);
      if (response.success) {
        toast.success("Successfully reviewed!");
        setReviewDiv(false);
        if (onReviewPosted) onReviewPosted();
      } else {
        toast.error(response.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error("Error submitting review");
    }
  };

  return (
    <div className="review-overlay">
      <div className="review-container">
        <div className="review-header">
          <h2>Write a Review</h2>
          <X className="cross-sym" onClick={() => setReviewDiv(false)} />
        </div>

        <div className="review-main">
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className={star <= rating ? "star filled" : "star"}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <label htmlFor="review-textarea" className="review-label">
            Tell us what you loved!
          </label>
          <textarea
            id="review-textarea"
            placeholder="Share your experience..."
            rows="5"
            onChange={(e) => setReviewText(e.target.value)}
            value={reviewText}
          />

          <div className="review-buttons">
            <button className="cancel-btn" onClick={() => setReviewDiv(false)}>
              Cancel
            </button>
            <button className="submit-btn" onClick={reviewSubmitHandler}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
