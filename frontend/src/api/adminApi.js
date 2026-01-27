import axios from "axios";

const API_URL = "http://localhost:2167/api/admin";

const getConfig = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ===== Stats =====
export const getAdminStats = async () => {
  const { data } = await axios.get(`${API_URL}/stats`, getConfig());
  return data;
};

// ===== Users =====
export const getAllUsers = async () => {
  const { data } = await axios.get(`${API_URL}/users`, getConfig());
  return data;
};

export const updateUser = async (userId, updates) => {
  const { data } = await axios.put(
    `${API_URL}/users/${userId}`,
    updates,
    getConfig()
  );
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await axios.delete(
    `${API_URL}/users/${userId}`,
    getConfig()
  );
  return data;
};

// ===== Bookings =====
export const getAllBookings = async () => {
  const { data } = await axios.get(`${API_URL}/bookings`, getConfig());
  return data;
};

export const updateBooking = async (bookingId, updates) => {
  const { data } = await axios.put(
    `${API_URL}/bookings/${bookingId}`,
    updates,
    getConfig()
  );
  return data;
};

export const deleteBooking = async (bookingId) => {
  const { data } = await axios.delete(
    `${API_URL}/bookings/${bookingId}`,
    getConfig()
  );
  return data;
};

// ===== Reviews =====
export const getAllReviews = async () => {
  const { data } = await axios.get(`${API_URL}/reviews`, getConfig());
  return data;
};

export const updateReview = async (reviewId, updates) => {
  const { data } = await axios.put(
    `${API_URL}/reviews/${reviewId}`,
    updates,
    getConfig()
  );
  return data;
};

export const deleteReview = async (reviewId) => {
  const { data } = await axios.delete(
    `${API_URL}/reviews/${reviewId}`,
    getConfig()
  );
  return data;
};

// ===== Coupons =====

// Get all coupons
export const getAllCoupons = async () => {
  const { data } = await axios.get(`${API_URL}/coupons`, getConfig());
  return data;
};

// Get single coupon
export const getCouponById = async (couponId) => {
  const { data } = await axios.get(
    `${API_URL}/coupons/${couponId}`,
    getConfig()
  );
  return data;
};

// Create a new coupon
export const createCoupon = async (couponData) => {
  const { data } = await axios.post(
    `${API_URL}/coupons`,
    couponData,
    getConfig()
  );
  return data;
};

// Update a coupon
export const updateCoupon = async (couponId, updates) => {
  const { data } = await axios.put(
    `${API_URL}/coupons/${couponId}`,
    updates,
    getConfig()
  );
  return data;
};

// Delete a coupon
export const deleteCoupon = async (couponId) => {
  const { data } = await axios.delete(
    `${API_URL}/coupons/${couponId}`,
    getConfig()
  );
  return data;
};

// Get coupons available for users (public)
export const getCouponsForUsers = async () => {
  const { data } = await axios.get(`http://localhost:2167/api/coupons/public`);
  return data;
};

// ===== Payments =====

// Get all payments
export const getAllPayments = async () => {
  const { data } = await axios.get(`${API_URL}/payments`, getConfig());
  return data;
};

// Update payment status

// Delete a payment
export const deletePayment = async (paymentId) => {
  const { data } = await axios.delete(
    `${API_URL}/payments/${paymentId}`,
    getConfig()
  );
  return data;
};
