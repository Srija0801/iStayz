import React, { useEffect, useState } from "react";
import "../styles/Footer.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const logOutHandler = () => {
    navigate("/Authentication/login");
    window.location.reload();
    localStorage.removeItem("user");

    setUser(null);
  };
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>
            <span>i</span>Stay<span className="gold-text">Z</span>
          </h2>
        </div>

        <div className="footer-navs">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/coupons">Coupons</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/Authentication/login" onClick={logOutHandler}>
                {user ? "Logout" : "Login"}
              </Link>
            </li>
            <li>
              <Link to="/Authentication/signup">Signup</Link>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: support@istayz.com</p>
          <p>Phone: +91 1234567890</p>
          <p>Address: Hanamkonda, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 iStayZ. All rights reserved.</p>
      </div>
    </footer>
  );
}
