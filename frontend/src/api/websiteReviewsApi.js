import axios from "axios";

const API_URL = "http://localhost:2167/api/websiteReviews";

export const getReviews = async () => {
  const { data } = await axios.get(`${API_URL}/getReviews`);
  return data;
};

export const setReview = async (comment, rating, createdBy) => {
  if (!comment || !rating || !createdBy) {
    throw new Error("invalid inputs for review");
  }

  const { data } = await axios.post(`${API_URL}/setReview`, {
    comment,
    rating,
    createdBy,
  });
  return data;
};
