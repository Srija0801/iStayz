import React, { use, useEffect, useState } from "react";
import "../styles/Navbar.css";
import { Menu, Pointer, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import default_img from "../assets/default_profile/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";
import Profile_hover from "../components/profile_hover";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(false);
  const [hoverLink, setHoverLink] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      }
    } catch (err) {
      console.error("Failed to parse user:", err);
    }
  }, []);

  const logoutHandler = () => {
    navigate("/Authentication/login");

    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      <div className="navbar-container">
        <Link to="/" className="nav-link" style={{ cursor: Pointer }}>
          <div className="logo-container">
            <span>i</span>Stay<span style={{ color: "white" }}>Z</span>
          </div>
        </Link>

        <div className="hamburger" onClick={() => setActiveMenu(!activeMenu)}>
          {activeMenu ? <X size={28} /> : <Menu size={28} />}
        </div>

        <div className={`links-container ${activeMenu ? "active" : ""}`}>
          <div className="links-data">
            <ul>
              {user && user.role === "admin" && (
                <li>
                  <NavLink to="/admin/dashboard" className="nav-link">
                    Admin Dashboard
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to="/coupons" className="nav-link">
                  Coupons and codes
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="nav-link">
                  About us
                </NavLink>
              </li>
            </ul>
          </div>

          {user ? (
            <div
              className="nav-link" // keep same class for styling
              onMouseEnter={() => setHoverLink(true)}
              onMouseLeave={() => setHoverLink(false)}
            >
              <div className="profile-container">
                <div className="user-name-container">{user.fullName}</div>
                <div className="user-profile-container">
                  <img src={user.profilePicture || default_img} alt="profile" />
                </div>
                {hoverLink ? (
                  <Profile_hover logoutHandler={logoutHandler} />
                ) : null}
              </div>
            </div>
          ) : (
            <div className="buttons-container">
              <NavLink to="/Authentication/login">
                <button type="submit" className="login-button">
                  Login
                </button>
              </NavLink>
              <NavLink to="/Authentication/signup">
                <button type="submit" className="signup-button">
                  Create Account
                </button>
              </NavLink>
            </div>
          )}
        </div>
      </div>

      <div className="Discount-container">
        <marquee scrollamount="11">
          ONE OF THE BEST WEBSITES FOR HOTEL BOOKINGS ♥
        </marquee>
      </div>
    </>
  );
}
