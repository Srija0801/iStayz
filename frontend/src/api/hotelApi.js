import axios from "axios";

const fetchHotels = async (city, checkIn, checkOut, adults) => {
  try {
    const res = await axios.get(`http://localhost:2167/api/hotels/search`, {
      params: {
        city,
        checkIn,
        checkOut,
        adults,
      },
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export default fetchHotels;
