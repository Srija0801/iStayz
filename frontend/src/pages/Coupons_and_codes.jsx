import React, { useEffect, useRef, useState } from "react";
import "../styles/Coupons.css";
import { Search } from "lucide-react";
import Coupon_Blog from "../components/Coupon_Blog";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "react-toastify";
import Help_Centre from "../components/Help_Center";
import { getCouponsForUsers } from "../api/adminApi";

gsap.registerPlugin(ScrollTrigger);

export default function Coupons_and_codes() {
  const [coupons, setCoupons] = useState([]);
  const [couponSearch, setCouponSearch] = useState("");
  const titleRef = useRef(null);

  // Scroll to top & animate heading
  useEffect(() => {
    window.scrollTo(0, 0);

    // Kill previous GSAP triggers/tweens
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf("*");

    if (!titleRef.current) return;
    const title = titleRef.current;

    // Split h1 text into spans for characters
    const text = title.textContent;
    title.textContent = "";
    const chars = text.split("").map((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      title.appendChild(span);
      return span;
    });

    // Animate main heading
    gsap.set(chars, { opacity: 0, y: 100 });
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      duration: 0.8,
      ease: "back.out(1.7)",
    });

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf("*");
    };
  }, []);

  // Fetch all coupons on mount
  useEffect(() => {
    const fetchAllCoupons = async () => {
      try {
        const data = await getCouponsForUsers();
        if (data && Array.isArray(data)) setCoupons(data);
        else if (data && data.coupons && Array.isArray(data.coupons))
          setCoupons(data.coupons);
        else setCoupons([]);
      } catch (err) {
        console.error("Failed to fetch coupons:", err);
        setCoupons([]);
      }
    };

    fetchAllCoupons();
  }, []);

  // Animate coupons when they are loaded
  useEffect(() => {
    if (!coupons || coupons.length === 0) return;

    gsap.set(".coupons-blog-container > *", { opacity: 0, y: 30 });
    gsap.to(".coupons-blog-container > *", {
      scrollTrigger: {
        trigger: ".coupons-blog-container",
        start: "top 90%",
        end: "bottom 40%",
        scrub: true,
        toggleActions: "play none none none",
      },
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power2.out",
    });
  }, [coupons]);

  // Handle search
  const coupon_search_Handler = (e) => {
    e.preventDefault();
    const coupon_section = document.getElementById("coupons-section");
    if (coupon_section && couponSearch) {
      coupon_section.scrollIntoView({ behavior: "smooth" });
    } else {
      toast.warn("No coupon entered!");
    }
  };

  // Filter coupons by search term
  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(couponSearch.toLowerCase())
  );

  return (
    <>
      <Help_Centre />

      <section id="main-coupon-section" className="sections-coupons">
        <div className="search-coupon-container">
          <form onSubmit={coupon_search_Handler}>
            <div className="search-container">
              <input
                type="search"
                className="search-box"
                placeholder="Search Coupon"
                value={couponSearch}
                onChange={(e) => setCouponSearch(e.target.value)}
              />
              <div className="search-icon" onClick={coupon_search_Handler}>
                <Search size={24} strokeWidth={2.5} />
              </div>
            </div>
          </form>
        </div>
        <div className="intro-coupons-container">
          <div className="title-intro">
            <h1 id="Title-id" ref={titleRef}>
              iStayZ - Coupons
            </h1>
          </div>
        </div>
      </section>

      <section className="sections-coupons" id="coupons-section">
        <div className="coupons-heading">
          <h2>Coupons for today</h2>
        </div>
        <div className="coupons-blog-container">
          {filteredCoupons.length > 0 ? (
            filteredCoupons.map((coupon) => (
              <Coupon_Blog key={coupon._id} coupon={coupon} />
            ))
          ) : (
            <p>No coupons found.</p>
          )}
        </div>
      </section>
    </>
  );
}
