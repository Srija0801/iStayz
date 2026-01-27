import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { toast } from "react-toastify";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Review_Card from "../components/Review_Blog";
import Help_Centre from "../components/Help_Center";
import { useNavigate } from "react-router-dom";
import ReviewDiv from "../components/ReviewDiv";
import { getReviews } from "../api/websiteReviewsApi";
import { indianCities } from "../assets/city_blog/Cities.js";
import axios from "axios";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const navigate = useNavigate();
  // Form state
  const [formData, setFormData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    numberOfPeople: "",
  });

  const UserFormHandler = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!formData.destination) {
      toast.error("Destination is Required!");
      return;
    }
    if (!formData.checkIn || !formData.checkOut) {
      toast.warn("Enter the Check-in, check-out dates");
      return;
    }
    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      toast.error("Check-in should be before the check-out only");
      return;
    }
    if (!formData.numberOfPeople || formData.numberOfPeople <= 0) {
      toast.info("Invalid Count of people");
      return;
    }

    toast.success("Searching for hotels...");
    navigate(
      `/location/${formData.destination}?checkIn=${formData.checkIn}&checkOut=${formData.checkOut}&people=${formData.numberOfPeople}`
    );
    console.log("Form data:", formData);

    setFormData({
      destination: "",
      checkIn: "",
      checkOut: "",
      numberOfPeople: "",
    });
  };

  const [reviewDiv, setReviewDiv] = useState(false);

  const reviewDivHandler = () => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      setReviewDiv(true);
    } else {
      toast.error("Please login to write a review");
      navigate("Authentication/login");
    }
  };

  const [reviews, setReviews] = useState([]);
  const fetchReviews = async () => {
    try {
      const response = await getReviews();
      if (response.success) {
        setReviews(response.reviews || []);
      } else {
        toast.info("No reviews to show");
      }
    } catch (error) {
      toast.error("Failed to fetch the reviews");
    }
  };

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const allPhotos = await Promise.all(
          indianCities.map(async (city) => {
            const res = await axios.get(
              `http://localhost:2167/api/city/photos/${city.name}`
            );
            if (res.data.success) {
              return { city: city.name, photos: res.data.photos };
            } else {
              return { city: city.name, photos: [] };
            }
          })
        );
        setPhotos(allPhotos); // [{city: "Mumbai", photos: [...]}, ...]
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchReviews();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- City Heading fade/slide ---
      const cityHeading = document.querySelector(".city-heading-container h1");
      if (cityHeading) {
        gsap.set(cityHeading, { opacity: 0, y: 30 });
        gsap.to(cityHeading, {
          opacity: 1,
          y: 0,
          ease: "power1.out",
          scrollTrigger: {
            trigger: ".city-heading-container",
            start: "top 90%",
            end: "top 50%",
            scrub: true,
          },
        });
      }

      // --- City Cards animation ---
      const cityRows = gsap.utils.toArray(".city-blog-container > *");
      cityRows.forEach((row, i) => {
        gsap.set(row, { opacity: 0, y: 20 });
        gsap.to(row, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: i * 0.06,
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
            toggleActions: "play none none none",
            scrub: true,
          },
        });
      });

      // --- Review Heading same as City Heading ---
      const reviewHeading = document.querySelector("#Review-title");
      if (reviewHeading) {
        gsap.set(reviewHeading, { opacity: 0, y: 30 });
        gsap.to(reviewHeading, {
          opacity: 1,
          y: 0,
          ease: "power1.out",
          scrollTrigger: {
            trigger: "#Review-title",
            start: "top 90%",
            end: "top 50%",
            scrub: true,
          },
        });
      }

      // --- Review Cards animation ---
      const reviewCards = gsap.utils.toArray(".review-blog-container > *");
      reviewCards.forEach((card, i) => {
        gsap.set(card, { opacity: 0, y: 20 });
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: i * 0.08,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
            scrub: true,
          },
        });
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [reviews]);

  useEffect(() => {
    window.scrollTo(0, 0);

    gsap.set("#main-page-quote, .Search-container", { opacity: 0, y: 50 });
    const tl = gsap.timeline();
    tl.to("#main-page-quote", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    }).to(
      ".Search-container",
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.5"
    );

    gsap.to("#letter-i", {
      rotationX: 720,
      duration: 1,
      repeat: -1,
      ease: "power2.inOut",
    });
    gsap.to("#letter-z", {
      rotationY: 360,
      duration: 1.2,
      repeat: -1,
      ease: "power2.inOut",
    });
  }, []);

  return (
    <>
      {reviewDiv && (
        <ReviewDiv
          setReviewDiv={setReviewDiv}
          onReviewPosted={async () => {
            try {
              const response = await getReviews();
              if (response.success) setReviews(response.reviews || []);
            } catch (error) {
              toast.error("Failed to fetch updated reviews");
            }
          }}
        />
      )}
      <Help_Centre />

      {/* Landing Section */}
      <section id="main-location-search">
        <div className="main-landing-section">
          <div className="Logo-container">
            <h1 id="main-page-quote">
              <span
                id="letter-i"
                style={{
                  display: "inline-block",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "visible",
                }}
              >
                i
              </span>
              Stay
              <span
                id="letter-z"
                style={{
                  display: "inline-block",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "visible",
                  color: "#d4af37",
                }}
              >
                Z
              </span>
            </h1>
          </div>

          <div className="Search-container">
            <form onSubmit={submitHandler}>
              <h2>
                Search for the <span>Hotels</span>
              </h2>

              <div className="destination-container">
                <label htmlFor="destination">
                  Enter place :
                  <input
                    id="destination"
                    type="text"
                    onChange={UserFormHandler}
                    value={formData.destination}
                    placeholder="Ex. Hyderabad"
                  />
                </label>
              </div>

              <div className="check-in-out-container">
                <label htmlFor="checkIn">
                  Check-in Date :
                  <input
                    id="checkIn"
                    type="date"
                    value={formData.checkIn}
                    onChange={UserFormHandler}
                  />
                </label>
                <label htmlFor="checkOut">
                  Check-out Date :
                  <input
                    id="checkOut"
                    type="date"
                    value={formData.checkOut}
                    onChange={UserFormHandler}
                  />
                </label>
              </div>

              <label htmlFor="numberOfPeople">
                Adults :
                <input
                  id="numberOfPeople"
                  type="number"
                  placeholder="Ex. 3"
                  value={formData.numberOfPeople}
                  onChange={UserFormHandler}
                />
              </label>

              <button type="submit">Search</button>
            </form>
          </div>
        </div>
      </section>
      <section id="city-blog-section">
        <div className="city-heading-container">
          <h1>Book a hotel in your fav cities </h1>
        </div>
        <div className="city-blog-container">
          {photos.map((cityData) => (
            <div className="city-blog" key={cityData.city}>
              {cityData.photos.length > 0 ? (
                <img
                  src={cityData.photos[0].url}
                  alt={cityData.city}
                  width={200}
                  height={150}
                />
              ) : (
                <div
                  style={{
                    width: 200,
                    height: 150,
                    backgroundColor: "#ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#555",
                  }}
                >
                  No Image
                </div>
              )}
              <h3>{cityData.city}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="Site-reviews">
        <div className="Reviews-Container">
          <h1 id="Review-title">Our Reviews</h1>
        </div>
        <div className="review-blog-container">
          {reviews.map((review, index) => {
            return <Review_Card review={review} key={index} />;
          })}
        </div>
        <div className="review-submit">
          <button onClick={reviewDivHandler}>Write a Review</button>
        </div>
      </section>
    </>
  );
}
