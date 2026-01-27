import axios from "axios";

const API_URL = "http://localhost:2167/api/payment";

// 🧾 Step 1: Create an order from backend
export const createOrder = async (amount, userId) => {
  const { data } = await axios.post(`${API_URL}/create-order`, {
    amount,
    userId,
  });
  return data;
};

// ✅ Step 2: Verify payment after success
export const verifyPayment = async (paymentData) => {
  const { data } = await axios.post(`${API_URL}/verify-payment`, paymentData);
  return data;
};

export const getAPIKEY = async () => {
  const { data } = await axios.get(`${API_URL}/get-RAZORKEY`);
  return data.key;
};
