import React, { useState, useEffect } from "react";
import "../styles/profile_hover.css";
import { Link } from "react-router-dom";

export default function Profile_hover({ logoutHandler }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return null;

  return (
    <div className="profile-hover-container">
      <ul>
        <li>
          <Link
            to={`/user_profile/${user._id}/editProfile`}
            className="link-container"
          >
            {user.fullName}
          </Link>
        </li>

        <li>
          <Link
            to={`/user_profile/${user._id}/editProfile`}
            className="link-container"
          >
            Edit profile
          </Link>
        </li>
        <li>
          <Link
            to={`/user_profile/${user._id}/myBookings`}
            className="link-container"
          >
            My bookings
          </Link>
        </li>
        <li>
          <Link
            to={`/user_profile/${user._id}/myWishlist`}
            className="link-container"
          >
            Wishlist
          </Link>
        </li>
        <li>
          <Link
            to={`/user_profile/${user._id}/location`}
            className="link-container"
          >
            Location
          </Link>
        </li>
        <li>
          <button type="button" onClick={logoutHandler}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
