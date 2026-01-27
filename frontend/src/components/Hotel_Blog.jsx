import React from "react";
import "../styles/Hotel_Blog.css";
import hotel_1 from "../assets/hotel_picture/temp.avif";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function Hotel_Blog({ hotel, checkIn, checkOut, people }) {
  if (!hotel) return null;

  const hotelImage =
    hotel.thumbnails && hotel.thumbnails.length > 0
      ? hotel.thumbnails[1] || hotel.thumbnails[0] || hotel.thumbnails[2]
      : hotel_1;

  return (
    <Link
      to={`/hotel/${hotel.id}/${hotel.city}/${checkIn}/${checkOut}/${people}`}
    >
      <div className="hotel-blog">
        <div className="hotel-picture">
          <img src={hotelImage} alt={hotel.name || "Hotel"} />
        </div>

        <div className="hotel-details-container">
          <div className="hotel-name">
            <h2>{hotel.name || "Unnamed Hotel"}</h2>
          </div>
          <div className="hotel-location-details">
            <MapPin size={18} className="map-pin" /> {hotel.city || "Unknown"}
          </div>
          <div className="hotel-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={
                  star <= (hotel.rating || 0) ? "filled-star" : "empty-star"
                }
              />
            ))}
          </div>
          <div className="hotel-price">{`₹ ${
            hotel.price_per_night || hotel.total_price || 0
          }`}</div>
          <div className="hotel-description">
            {hotel.description || "Description Not Available"}
          </div>
        </div>
      </div>
    </Link>
  );
}
