import React, { useState, useEffect } from "react";
import "../styles/HomeSelected.css";
import mainHotelPic from "../assets/hotel_picture/homepage_slider.webp";
import { useParams, useNavigate } from "react-router-dom";
import MapwithAddress from "../components/MapComponent";
import fetchHotels from "../api/hotelApi";
import { toast } from "react-toastify";
import { createBooking } from "../api/bookingApi";
import { createOrder, verifyPayment, getAPIKEY } from "../api/paymentApi";
import {
  addWishlist,
  checkWishlist,
  removeWishlist,
} from "../api/userDetailsApi";
import axios from "axios";

export default function HotelSelected() {
  const [key, setKey] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [orderId, setOrderId] = useState("");

  const default_description = `Our hotel offers a blend of modern design and warm hospitality.
Each room is crafted for comfort with stylish décor and premium fittings.
Guests can enjoy on-site dining, a relaxing lounge, and fitness facilities.
The property features beautiful interiors and a calm, inviting atmosphere.
Perfect for travelers seeking both comfort and convenience.`;

  const { id, city, checkIn, checkOut, adults } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !city || !checkIn || !checkOut || !adults) return;
      try {
        const data = await fetchHotels(city, checkIn, checkOut, adults);
        if (!data?.hotels?.length) return toast.error("No hotels found");

        const hotelById = data.hotels.find((h) => h.id.toString() === id);
        if (!hotelById) return toast.error("Hotel not found");

        setSelectedHotel(hotelById);

        if (user) {
          const isWishlisted = await checkWishlist(user._id, hotelById.id);
          setWishlisted(isWishlisted);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch hotel data");
      }
    };
    fetchData();
  }, [city, checkIn, checkOut, adults, id, user]);

  const wishlistHandler = async () => {
    if (!user) {
      navigate("/Authentication/login", {
        state: { from: window.location.pathname },
      });
      return;
    }
    try {
      if (wishlisted) {
        await removeWishlist(user._id, selectedHotel.id);
        toast.info("Removed from your wishlist");
        setWishlisted(false);
      } else {
        const wishlistData = {
          id: user._id,
          hotelId: {
            id: selectedHotel.id,
            name: selectedHotel.name,
            city: selectedHotel.city,
            description: selectedHotel.description,
            image: selectedHotel.image || selectedHotel.main_image || "",
            price: selectedHotel.price_per_night || 0,
            rating: selectedHotel.rating || 0,
          },
          city: selectedHotel.city,
          checkIn,
          checkOut,
          adults,
        };
        await addWishlist(wishlistData);
        toast.success("Added to your wishlist!");
        setWishlisted(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wishlist");
    }
  };

  const applyCoupon = () => {
    let total = selectedHotel.price_per_night * parseInt(adults);
    if (coupon.toLowerCase() === "istayz10") {
      const discountAmt = total * 0.1;
      setDiscount(discountAmt);
      total -= discountAmt;
      toast.success("Coupon applied! 10% off");
    } else if (coupon.trim() !== "") {
      toast.error("Invalid coupon code");
      setDiscount(0);
    }
    setFinalAmount(total);
  };

  // ✅ Step 1: Send OTP
  const sendOtp = async (orderId) => {
    try {
      const res = await axios.post(
        "http://localhost:2167/api/payment/verify-payment-otp",
        {
          userId: user._id,
          orderId,
        }
      );
      toast.info(res.data.message);
      setOtpSent(true);
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  // ✅ Step 2: Handle Payment
  const handlePayment = async () => {
    if (!user) {
      navigate("/Authentication/login", {
        state: { from: window.location.pathname },
      });
      return;
    }

    try {
      const totalAmount =
        finalAmount || selectedHotel.price_per_night * parseInt(adults);

      const { success, key, orderId, amount, currency } = await createOrder(
        totalAmount,
        user._id
      );
      setKey(key);

      if (!success) {
        toast.error("Failed to create payment order");
        return;
      }

      setOrderId(orderId);
      await sendOtp(orderId);
      setShowOtpModal(true);
      setShowModal(false);
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Unable to start payment process");
    }
  };

  // ✅ Step 3: Verify OTP and Open Razorpay
  const verifyOtpAndPay = async () => {
    if (!otp.trim()) {
      toast.error("Please enter OTP before proceeding.");
      return;
    }

    const totalAmount =
      finalAmount || selectedHotel.price_per_night * parseInt(adults);

    const options = {
      key: key,
      amount: totalAmount * 100,
      currency: "INR",
      name: selectedHotel.name,
      description: "Hotel Booking Payment",
      order_id: orderId,
      handler: async (response) => {
        const verifyRes = await verifyPayment({
          ...response,
          userId: user._id,
          otp,
        });

        if (verifyRes.success) {
          const bookingData = {
            userId: user._id,
            hotel: {
              id: selectedHotel.id,
              name: selectedHotel.name,
              city: selectedHotel.city,
              description: selectedHotel.description,
              image: selectedHotel.image || selectedHotel.main_image || "",
              price: selectedHotel.price_per_night,
              rating: selectedHotel.rating || 0,
            },
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            adults: parseInt(adults),
            totalPrice: totalAmount,
          };

          await createBooking(bookingData);
          toast.success("Payment successful! Booking confirmed.");
          navigate(`/user_profile/${user._id}/myBookings`);
        } else {
          toast.error("Payment verification failed!");
        }
      },
      prefill: { name: user.fullName, email: user.email },
      theme: { color: "#1a73e8" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setShowOtpModal(false);
  };

  if (!selectedHotel) return <p>Loading hotel data...</p>;

  return (
    <div className="hotel-container">
      {/* HEADER SECTION */}
      <section className="hotel-header">
        <div className="hotel-image">
          <img src={selectedHotel.thumbnails[0]} alt="Hotel main" />
          <div className="hotel-info-overlay">
            <h2>{selectedHotel.name}</h2>
            <p className="hotel-city">{selectedHotel.city}</p>
            <p className="hotel-price">{`₹ ${selectedHotel.price_per_night} / night`}</p>
            <div className="buttons-container">
              <button
                className={`wishlist ${wishlisted ? "user_wishlisted" : ""}`}
                onClick={wishlistHandler}
              >
                &hearts; {wishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
              <button className="add-btn" onClick={() => setShowModal(true)}>
                Book Now
              </button>
            </div>
          </div>
        </div>

        <p className="subheading">
          {selectedHotel.amenities &&
            selectedHotel.amenities.map((a, i) => (
              <span key={i} className="amenity">
                {a}
              </span>
            ))}
        </p>

        <p className="description">
          {selectedHotel.description
            ? selectedHotel.description
            : default_description}
        </p>
      </section>

      {/* BOOKING MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Booking Summary</h3>
            <p>{selectedHotel.name}</p>
            <p>{`Base Price: ₹${
              selectedHotel.price_per_night * parseInt(adults)
            }`}</p>
            {discount > 0 && <p>{`Discount: -₹${discount}`}</p>}
            <h4>{`Total: ₹${
              finalAmount || selectedHotel.price_per_night * parseInt(adults)
            }`}</h4>

            <div className="coupon-section">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={applyCoupon}>Apply</button>
            </div>

            <div className="modal-actions">
              <button onClick={handlePayment} className="pay-btn">
                Proceed to Pay
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Email OTP Verification</h3>
            <p>An OTP has been sent to your registered email.</p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              className="otp-input"
            />
            <div className="modal-actions">
              <button onClick={verifyOtpAndPay} className="pay-btn">
                Verify & Pay
              </button>
              <button
                onClick={() => setShowOtpModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="hotel-gallery">
        <h2>Gallery</h2>
        <div className="gallery-grid">
          {selectedHotel?.thumbnails?.map((image, idx) => (
            <div key={idx} onClick={() => setLightboxImage(image)}>
              <img src={image} alt={`Hotel thumbnail ${idx}`} />
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- LIGHTBOX ---------------- */}
      {lightboxImage && (
        <div className="lightbox open" onClick={() => setLightboxImage(null)}>
          <span className="lightbox-close">&times;</span>
          <img className="lightbox-content" src={lightboxImage} alt="View" />
        </div>
      )}

      {/* ---------------- LOCATION ---------------- */}
      <section className="hotel-location">
        <h1>Location</h1>
        <div className="map-box">
          <MapwithAddress
            lat={selectedHotel.coordinates?.latitude || 0}
            lng={selectedHotel.coordinates?.longitude || 0}
            hotel={selectedHotel}
          />
        </div>
        <div className="coordinates">
          <p>{`Longitude: ${selectedHotel.coordinates?.longitude || 0}`}</p>
          <p>{`Latitude: ${selectedHotel.coordinates?.latitude || 0}`}</p>
        </div>
      </section>

      {/* ---------------- HOTEL INSIGHTS ---------------- */}
      <section className="hotel-insights">
        <h2>Hotel Insights</h2>

        {/* ⭐ Ratings Breakdown */}
        {selectedHotel.ratings && selectedHotel.ratings.length > 0 && (
          <div className="ratings-breakdown">
            <h3>Ratings Breakdown</h3>
            {selectedHotel.ratings.map((r, idx) => (
              <div key={idx} className="rating-bar">
                <span>{r.stars}★</span>
                <div className="bar">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${
                        (r.count / selectedHotel.total_reviews) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span>{r.count}</span>
              </div>
            ))}
          </div>
        )}

        {/* 📍 Nearby Places */}
        {selectedHotel.nearby_places &&
          selectedHotel.nearby_places.length > 0 && (
            <div className="nearby-places">
              <h3>Nearby Places</h3>
              <ul>
                {selectedHotel.nearby_places.map((place, idx) => (
                  <li key={idx}>
                    <strong>{place.name}</strong> –{" "}
                    {place.transportations &&
                      place.transportations.map((t, i) => (
                        <span key={i}>
                          {t.type} ({t.duration})
                          {i < place.transportations.length - 1 && ", "}
                        </span>
                      ))}
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* 🏥 Health & Safety Measures */}
        {selectedHotel.health_and_safety?.groups &&
          selectedHotel.health_and_safety.groups.length > 0 && (
            <div className="health-safety">
              <h3>Health & Safety Measures</h3>
              {selectedHotel.health_and_safety.groups.map((group, idx) => (
                <div key={idx} className="safety-group">
                  <h4>{group.title}</h4>
                  <ul>
                    {group.list.map((item, i) => (
                      <li key={i}>
                        {item.available ? "✅" : "❌"} {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

        {/* 💸 Price Comparison */}
        {selectedHotel.prices && selectedHotel.prices.length > 0 && (
          <div className="price-comparison">
            <h3>Price Comparison</h3>
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Rate Per Night</th>
                  <th>Before Taxes</th>
                </tr>
              </thead>
              <tbody>
                {selectedHotel.prices.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.source}</td>
                    <td>₹{p.rate_per_night?.extracted_lowest || "N/A"}</td>
                    <td>
                      ₹{p.rate_per_night?.extracted_before_taxes_fees || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 🌿 Eco Certification */}
        {selectedHotel.eco_certified && (
          <div className="eco-badge">
            <h3>Eco Certification</h3>
            <p>
              🌿 This property follows eco-friendly sustainability standards.
            </p>
          </div>
        )}

        {/* ℹ️ Essential Info */}
        {selectedHotel.essential_info &&
          selectedHotel.essential_info.length > 0 && (
            <div className="essential-info">
              <h3>Essential Info</h3>
              <ul>
                {selectedHotel.essential_info.map((info, idx) => (
                  <li key={idx}>{info}</li>
                ))}
              </ul>
            </div>
          )}
      </section>
    </div>
  );
}
