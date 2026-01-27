import React, { useEffect } from "react";
import "../styles/About_Us.css";
import { Globe, Lightbulb, Users, Rocket } from "lucide-react";

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(
      ".about-card, .about-header, .about-footer"
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-us">
      <div className="about-header">
        <h1>
          About <span>iStayZ</span>
        </h1>
        <p>Your trusted partner in hassle-free hotel reservations</p>
      </div>

      <div className="about-card">
        <Globe className="icon" size={40} />
        <h2>Our Mission</h2>
        <p>
          To make travel easier by connecting guests with hotels through
          innovative technology, ensuring comfort, affordability, and
          convenience.
        </p>
      </div>

      <div className="about-card">
        <Lightbulb className="icon" size={40} />
        <h2>What We Offer</h2>
        <ul>
          <li>✅ Seamless Hotel Bookings – Quick, secure, and reliable.</li>
          <li>✅ Smart Recommendations – AI-powered suggestions for you.</li>
          <li>✅ 24/7 Support – Always ready to assist you.</li>
          <li>✅ Trusted Partners – Best deals from top hotels.</li>
        </ul>
      </div>

      <div className="about-card">
        <Users className="icon" size={40} />
        <h2>Who We Are</h2>
        <p>
          We are a passionate team of developers, travel enthusiasts, and
          hospitality experts who share one vision: to revolutionize the way
          people book hotels online.
        </p>
      </div>

      <div className="about-card">
        <Rocket className="icon" size={40} />
        <h2>Why Choose Us?</h2>
        <div className="grid">
          <span>🌟 User-friendly platform</span>
          <span>⚡ Fast & secure payments</span>
          <span>🎁 Exclusive discounts</span>
          <span>😊 Happy travelers community</span>
        </div>
      </div>

      <div className="about-footer">
        <p>
          At <strong>iStayZ</strong>, we don’t just help you book rooms — we
          help you create memories. ✨
        </p>
      </div>
    </section>
  );
}
