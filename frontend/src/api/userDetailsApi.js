import axios from "axios";

const API_URL = "http://localhost:2167";

export const userDetails = async (id) => {
  const { data } = await axios.get(`${API_URL}/user/${id}`);
  return data;
};

export const uploadDetails = async (id, formData) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/api/user/UploadProfile/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

export const removePicture = async (id) => {
  try {
    const { data } = await axios.delete(
      `${API_URL}/api/user/DeleteProfile/${id}`
    );
    return data;
  } catch (error) {
    console.error("Remove failed:", error);
  }
};

// ✅ Fix addWishlist to accept a single object
export const addWishlist = async (wishlistData) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/api/user/addWishlist`,
      wishlistData
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ✅ Check wishlist remains same
export const checkWishlist = async (id, hotel_id) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/api/user/checkWishlist/${id}/${hotel_id}`
    );
    return data.exists;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// ✅ Remove wishlist now correctly passes both user id and hotel id
export const removeWishlist = async (id, hotel_id) => {
  try {
    const { data } = await axios.delete(
      `${API_URL}/api/user/removeWishlist/${id}/${hotel_id}`
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
