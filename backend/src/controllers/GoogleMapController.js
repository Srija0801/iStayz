const axios = require("axios");

const getAddressFromCoordinates = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng)
    return res.status(400).json({ message: "Coordinates missing" });

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          lat,
          lon: lng,
          format: "json",
        },
        headers: {
          "User-Agent": "MERN-App", // Nominatim requires a user-agent
        },
      }
    );

    const address = response.data.display_name || "No address found";
    res.json({ address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch address" });
  }
};

module.exports = getAddressFromCoordinates;
