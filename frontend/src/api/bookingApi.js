import axios from "axios";

const API_URL = "http://localhost:2167/api/bookings";

export const createBooking = async (bookingData) => {
  const { data } = await axios.post(`${API_URL}/create`, bookingData);
  return data;
};

export const getUserBookings = async (userId) => {
  const { data } = await axios.get(`${API_URL}/user/${userId}`);
  return data.bookings;
};

export const deleteBooking = async (bookingId) => {
  const { data } = await axios.delete(`${API_URL}/${bookingId}`);
  return data;
};
