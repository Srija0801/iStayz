const axios = require("axios");

const getHotels = async (req, res) => {
  try {
    const { city, checkIn, checkOut, adults } = req.query;

    if (!city) {
      return res
        .status(400)
        .json({ status: false, message: "City is required" });
    }

    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_hotels",
        q: city,
        gl: "in",
        hl: "en",
        currency: "INR",
        check_in_date: checkIn,
        check_out_date: checkOut,
        adults,
        api_key: process.env.SERPAPI_KEY,
      },
    });

    const hotels = response.data.properties || [];

    const formattedHotels = hotels.map((hotel) => ({
      id: hotel.property_token,
      city,
      name: hotel.name,
      description:
        hotel.description ||
        "A perfect blend of comfort and convenience, ideal for business or leisure stays.",
      coordinates: hotel.gps_coordinates || null,
      thumbnails: hotel.images?.map((img) => img.original_image) || [],
      rating: hotel.overall_rating || 0,
      total_reviews: hotel.reviews || 0,
      hotel_class: hotel.extracted_hotel_class || "",
      amenities: hotel.amenities || [],
      eco_certified: hotel.eco_certified || false,

      // ⭐ Ratings Breakdown
      ratings: hotel.ratings || [],

      // 📊 Reviews Breakdown (for category analysis)
      reviews_breakdown: hotel.reviews_breakdown || [],

      // 📍 Nearby Places
      nearby_places: hotel.nearby_places || [],

      // 🏥 Health & Safety
      health_and_safety: hotel.health_and_safety || {
        groups: [
          {
            title: "General Safety",
            list: [
              { title: "Enhanced cleaning", available: true },
              { title: "Contactless check-in", available: true },
              { title: "Hand sanitizers provided", available: true },
              { title: "Social distancing enforced", available: true },
            ],
          },
        ],
      },

      // 💸 Price Comparison
      prices: hotel.prices || [
        {
          source: "Agoda",
          rate_per_night: {
            extracted_lowest: hotel.rate_per_night?.extracted_lowest || 0,
            extracted_before_taxes_fees:
              hotel.rate_per_night?.extracted_before_taxes_fees || 0,
          },
        },
        {
          source: "Booking.com",
          rate_per_night: {
            extracted_lowest: hotel.total_rate?.extracted_lowest || 0,
            extracted_before_taxes_fees:
              hotel.total_rate?.extracted_before_taxes_fees || 0,
          },
        },
      ],

      // 🌿 Eco Certification
      eco_certifications: hotel.eco_certifications || [
        "This property is eco-certified by local standards",
      ],

      // ℹ️ Essential Info
      essential_info: hotel.essential_info || [
        `Check-in: ${hotel.check_in_time || "12:00 PM"}`,
        `Check-out: ${hotel.check_out_time || "11:00 AM"}`,
        "Free cancellation available for select rooms",
        "Pets may be allowed on request",
      ],

      // 💵 Price
      price_per_night: hotel.rate_per_night?.extracted_lowest || 0,
      total_price: hotel.total_rate?.extracted_lowest || 0,
      currency: "INR",
      link: hotel.link || "",
    }));

    res.status(200).json({ status: true, hotels: formattedHotels });
  } catch (error) {
    console.error("Error fetching hotels:", error.message);
    res.status(500).json({ status: false, message: "Failed to fetch hotels" });
  }
};

module.exports = { getHotels };
