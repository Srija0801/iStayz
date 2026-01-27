import axios from "axios";

const API_URL = "http://localhost:2167/api/users";

const getProfile = async () => {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const config = {
    headers: { Authorization: `Bearer ${userInfo.token}` },
  };
  const { data } = await axios.get(`${API_URL}/profile`, config);
  return data;
};

module.exports = getProfile;
