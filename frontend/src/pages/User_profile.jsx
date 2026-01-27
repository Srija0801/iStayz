import React, { useEffect, useRef, useState } from "react";
import "../styles/User_profile.css";
import default_profile from "../assets/user_default_profile/default_profile.png";
import Help_Centre from "../components/Help_Center";
import HotelCard from "../components/HotelCard.jsx";

import {
  userDetails,
  uploadDetails,
  removePicture,
  removeWishlist,
} from "../api/userDetailsApi.js";
import { getUserBookings } from "../api/bookingApi.js";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function User_profile() {
  const { choice, id } = useParams();

  const [user, setUser] = useState({
    _id: "",
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    city: "",
    pinCode: "",
    profilePicture: "",
    wishlist: [],
    bookings: [],
  });

  const [bookings, setBookings] = useState([]);
  const [edit, setEdit] = useState(false);
  const [edited_details, setEdited_details] = useState({
    phone: "",
    gender: "",
    city: "",
    pinCode: "",
    profilePicture: null,
  });

  const profileRef = useRef(null);
  const wishlistRef = useRef(null);
  const bookingsRef = useRef(null);
  const locationRef = useRef(null);

  // Scroll to section based on choice
  useEffect(() => {
    window.scrollTo(0, 0);
    if (choice === "editProfile" && profileRef.current)
      profileRef.current.scrollIntoView({ behavior: "smooth" });
    if (choice === "myWishlist" && wishlistRef.current)
      wishlistRef.current.scrollIntoView({ behavior: "smooth" });
    if (choice === "myBookings" && bookingsRef.current)
      bookingsRef.current.scrollIntoView({ behavior: "smooth" });
    if (choice === "location" && locationRef.current)
      locationRef.current.scrollIntoView({ behavior: "smooth" });
  }, [choice]);

  // Disable scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = edit ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [edit]);

  // Fetch user details and bookings
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = await userDetails(id);
        setUser({
          _id: userInfo._id || id,
          fullName: userInfo.fullName || "",
          email: userInfo.email || "",
          phone: userInfo.phone || "",
          gender: userInfo.gender || "",
          city: userInfo.city || "",
          pinCode: userInfo.pinCode || "",
          profilePicture: userInfo.profilePicture || default_profile,
          wishlist: userInfo.wishlist || [],
          bookings: userInfo.bookings || [],
        });

        if (userInfo._id) {
          const bookingsData = await getUserBookings(userInfo._id);
          setBookings(bookingsData || []);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to fetch user data");
      }
    };

    if (id) fetchUserData();
  }, [id]);

  // Remove profile picture
  const removeDpHandler = async () => {
    try {
      const res = await removePicture(id);
      if (res.status === 1) {
        toast.success("Successfully removed the picture");
        setUser((prev) => ({ ...prev, profilePicture: "" }));
        setEdited_details((prev) => ({ ...prev, profilePicture: null }));
      } else {
        toast.error(res.message || "Failed to remove the picture");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while removing picture");
    }
  };

  // Remove hotel from wishlist
  const handleRemoveWishlist = async (hotelId) => {
    try {
      const res = await removeWishlist(user._id, hotelId);
      if (res.message) {
        toast.success("Removed from wishlist successfully");
        setUser((prev) => ({
          ...prev,
          wishlist: prev.wishlist.filter(
            (item) => item.hotelId?.id !== hotelId
          ),
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove from wishlist");
    }
  };

  // Upload edited user details
  const uploadHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("phone", edited_details.phone || user.phone);
    formData.append("gender", edited_details.gender || user.gender);
    formData.append("city", edited_details.city || user.city);
    formData.append("pinCode", edited_details.pinCode || user.pinCode);
    if (edited_details.profilePicture) {
      formData.append("profilePicture", edited_details.profilePicture);
    }

    try {
      const data = await uploadDetails(id, formData);
      if (data.status === 1) {
        toast.success("Details updated successfully");
        setUser((prev) => ({
          ...prev,
          phone: edited_details.phone || prev.phone,
          gender: edited_details.gender || prev.gender,
          city: edited_details.city || prev.city,
          pinCode: edited_details.pinCode || prev.pinCode,
          profilePicture: data.profilePicture || prev.profilePicture,
        }));
        setEdited_details({
          phone: "",
          gender: "",
          city: "",
          pinCode: "",
          profilePicture: null,
        });
        setEdit(false);
      } else {
        toast.error(data.message || "Failed to update details");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating details");
    }
  };

  // Map labels to state keys
  const userFields = [
    { label: "Full Name", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Gender", key: "gender" },
    { label: "City", key: "city" },
    { label: "PinCode", key: "pinCode" },
  ];

  return (
    <>
      <Help_Centre />

      <div className="main-heading-user-profile" ref={profileRef}>
        <h1>
          Hii <span id="user-name">{user.fullName || "User"}</span>, How are
          you?
        </h1>
      </div>

      <div className="user-profile-container">
        {/* Personal Details */}
        <aside className="personal-details-container">
          <div className="picture-container">
            <img
              src={
                edited_details.profilePicture
                  ? URL.createObjectURL(edited_details.profilePicture)
                  : user.profilePicture || default_profile
              }
              alt="Profile"
              onError={(e) => (e.target.src = default_profile)}
            />
            <button onClick={() => setEdit(true)}>Edit</button>
            <button onClick={removeDpHandler}>Remove</button>
          </div>

          <div className="details-container" ref={locationRef}>
            {userFields.map(({ label, key }) => (
              <div className="detail-row" key={key}>
                <span className="detail-label">{label}</span>
                <span className="detail-value">{user[key] || "Not set"}</span>
                <button onClick={() => setEdit(true)}>Edit</button>
              </div>
            ))}
          </div>
        </aside>

        {/* Wishlist & Bookings */}
        <div className="bookings-wishlist-container">
          <div className="wishlist-container" ref={wishlistRef}>
            <h2>My Wishlist</h2>
            {user.wishlist.length > 0 ? (
              user.wishlist.map((hotel) => (
                <HotelCard
                  key={hotel.hotelId?.id || Math.random()}
                  hotel={hotel.hotelId}
                  checkIn={hotel.checkIn}
                  checkOut={hotel.checkOut}
                  people={hotel.adults}
                  onRemove={handleRemoveWishlist}
                  removeButtonText="Remove from Wishlist"
                  isWishlist={true}
                />
              ))
            ) : (
              <p>Nothing to show</p>
            )}
          </div>

          <div className="bookings-container" ref={bookingsRef}>
            <h2>My Bookings</h2>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <HotelCard
                  key={booking.hotel?.id || Math.random()}
                  hotel={booking.hotel}
                  checkIn={booking.checkIn}
                  checkOut={booking.checkOut}
                  people={booking.adults}
                  isWishlist={false}
                />
              ))
            ) : (
              <p>No bookings to show</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {edit && (
        <div className="modal-overlay" onClick={() => setEdit(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={uploadHandler}>
              <input
                type="text"
                placeholder="Phone"
                value={edited_details.phone || user.phone || ""}
                onChange={(e) =>
                  setEdited_details((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              />
              <select
                value={edited_details.gender || user.gender || ""}
                onChange={(e) =>
                  setEdited_details((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="City"
                value={edited_details.city || user.city || ""}
                onChange={(e) =>
                  setEdited_details((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
              />
              <input
                type="text"
                placeholder="Pin Code"
                value={edited_details.pinCode || user.pinCode || ""}
                onChange={(e) =>
                  setEdited_details((prev) => ({
                    ...prev,
                    pinCode: e.target.value,
                  }))
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEdited_details((prev) => ({
                    ...prev,
                    profilePicture: e.target.files[0],
                  }))
                }
              />
              <button type="submit">Upload</button>
              <button type="button" onClick={() => setEdit(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
