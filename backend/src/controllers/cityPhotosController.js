const axios = require("axios");

const getCityPhotos = async (req, res) => {
  const city = req.params.city;

  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query: `${city} city india`, per_page: 10 },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    const photos = response.data.results.map((photo) => ({
      id: photo.id,
      url: photo.urls.regular,
    }));

    res.json({ success: true, photos });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to fetch photos" });
  }
};

module.exports = getCityPhotos;
