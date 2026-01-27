import axios from "axios";

const API_URL = "http://localhost:2167/api/auth";

export const login = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/login`, { email, password });
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

export const register = async (fullName, email, password) => {
  const { data } = await axios.post(`${API_URL}/register`, {
    fullName,
    email,
    password,
  });
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

export const sendOtp = async (email) => {
  const { data } = await axios.post(`${API_URL}/send-otp`, { email });
  return data;
};

export const verifyOtp = async (email, otp, newPassword) => {
  const { data } = await axios.post(`${API_URL}/verify-otp`, {
    email,
    otp,
    newPassword,
  });
  return data;
};
