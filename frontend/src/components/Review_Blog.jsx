import React, { useEffect, useRef, useState } from "react";
import "../styles/Review_Blog.css";
import default_profile from "../assets/default_profile/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import { userDetails } from "../api/userDetailsApi.js";

gsap.registerPlugin(ScrollTrigger);

export default function Review_Card({ review }) {
  const [user, setUser] = useState({
    _id: "",
    fullName: "Anonymous",
    city: "Unknown",
    profilePicture: default_profile,
  });

  const cardRef = useRef(null);

  const storedData = JSON.parse(localStorage.getItem("user")) || {};

  // GSAP animation for each card
  useEffect(() => {
    const el = cardRef.current;
    gsap.set(el, { opacity: 1 });
    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, []);

  // Fetch user details for the review's creator
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // If review has createdBy field, fetch that user's info
        if (review.createdBy) {
          const userInfo = await userDetails(review.createdBy);
          setUser({
            _id: userInfo._id,
            fullName: userInfo.fullName || "Anonymous",
            city: userInfo.city || "Unknown",
            profilePicture: default_profile || userInfo.profilePicture,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [review.createdBy]);

  return (
    <div className="review-card" ref={cardRef}>
      <div className="Customer-review">
        <h2>{`"${review.comment}"`}</h2>
      </div>
      <div className="Customer-profile">
        <div className="Customer-profile-picture">
          <img src={default_profile} alt="profile" />
        </div>
        <div className="Customer-details">
          <div className="Customer-name">{user.fullName}</div>
          <div className="Customer-location">{user.city}</div>
          <div className="ratings">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={star <= review.rating ? "filled-star" : "empty-star"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
