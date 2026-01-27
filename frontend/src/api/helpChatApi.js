import axios from "axios";

const API_URL = "http://localhost:2167/api/help";

export const getChatHistory = async (token) => {
  const { data } = await axios.get(`${API_URL}/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const sendChatOption = async (option, token) => {
  const { data } = await axios.post(
    `${API_URL}/chat`,
    { option },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
