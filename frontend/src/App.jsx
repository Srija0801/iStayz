import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import Home from "./pages/Home";
import Main_search from "./pages/Main_search";
import AboutUs from "./pages/About_Us";
import Coupons_and_codes from "./pages/Coupons_and_codes";
import Login from "./pages/Login";
import Loader from "./components/Loader";
import { ToastContainer } from "react-toastify";
import InvoiceTest from "./pages/pdf";
import User_profile from "./pages/User_profile";
import HotelSelected from "./pages/HotelSelected";
import Admin_Dashboard from "./pages/AdminDashboard";

// Handles routes + loader
function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const firstLoad = useRef(true);

  // useEffect(() => {
  //   // Skip loader on very first render
  //   if (firstLoad.current) {
  //     firstLoad.current = false;
  //     return;
  //   }

  //   // Show loader only when route changes
  //   setLoading(true);
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 300);

  //   return () => clearTimeout(timer);
  // }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location/:id" element={<Main_search />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/coupons" element={<Coupons_and_codes />} />
        <Route path="/Authentication/:mode" element={<Login />} />
        <Route path="/Admin/Dashboard" element={<Admin_Dashboard />} />

        <Route path="/pdf" element={<InvoiceTest />} />
        <Route path="/user_profile/:id/:choice" element={<User_profile />} />

        <Route
          path="/hotel/:id/:city/:checkIn/:checkOut/:adults"
          element={<HotelSelected />}
        />
      </Routes>
      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={4000}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        theme="colored"
        toastStyle={{ marginTop: "7rem" }}
      />
    </>
  );
}

// Main App
export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
