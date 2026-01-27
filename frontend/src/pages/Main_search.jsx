import React, { useState, useEffect } from "react";
import "../styles/Main_search.css";
import Hotel_Blog from "../components/Hotel_Blog";
import Help_Centre from "../components/Help_Center";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import fetchHotels from "../api/hotelApi";

export default function Main_search() {
  const navigate = useNavigate();
  let [divOpen, setDivopen] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const people = searchParams.get("people");

  const [formData, setFormData] = useState({
    destination: id || "",
    checkIn,
    checkOut,
    people,
  });

  const [filterVal, setFilterVal] = useState({
    rating: null,
    total_reviews: null,
    price: null,
  });

  const formHandler = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "people" ? Number(value) : value,
    }));
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
    if (!formData.people || formData.people <= 0) {
      toast.info("Invalid Count of people");
      return;
    }

    toast.success("Searching for hotels...");
    navigate(
      `/location/${formData.destination}?checkIn=${formData.checkIn}&checkOut=${formData.checkOut}&people=${formData.people}`
    );
    setDivopen(false);
  };

  const [filteredHotels, setFilteredHotels] = useState([]);

  const handleFilterChange = (key, value) => {
    setFilterVal((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    let filtered = [...hotels];

    if (filterVal.rating) {
      filtered = filtered.filter((hotel) => hotel.rating >= filterVal.rating);
    }

    if (filterVal.total_reviews) {
      filtered = filtered.filter(
        (hotel) => hotel.total_reviews >= filterVal.total_reviews
      );
    }

    if (filterVal.price) {
      filtered = filtered.filter(
        (hotel) => hotel.price_per_night <= filterVal.price
      );
    }

    setFilteredHotels(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !checkIn || !checkOut) return;

      setLoading(true);
      try {
        const data = await fetchHotels(
          formData.destination,
          formData.checkIn,
          formData.checkOut,
          formData.people
        );
        if (!data) {
          toast.error("No data found");
        } else {
          setHotels(data.hotels);
        }
        console.log(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch the hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, checkIn, checkOut, people]);

  return (
    <>
      <Help_Centre />
      <div className="Main-search-asise-container">
        <aside className="filter-container">
          <div className="filter-section">
            <h4>Rating</h4>
            <select
              onChange={(e) =>
                handleFilterChange("rating", Number(e.target.value))
              }
            >
              <option value="">All</option>
              <option value="3">3★ & above</option>
              <option value="4">4★ & above</option>
              <option value="5">5★ only</option>
            </select>
          </div>

          <div className="filter-section">
            <h4>Total Reviews</h4>
            <select
              onChange={(e) =>
                handleFilterChange("total_reviews", Number(e.target.value))
              }
            >
              <option value="">All</option>
              <option value="100">100+</option>
              <option value="500">500+</option>
              <option value="1000">1000+</option>
            </select>
          </div>

          <div className="filter-section">
            <h4>Max Price</h4>
            <input
              type="number"
              placeholder="Enter max ₹"
              onChange={(e) =>
                handleFilterChange("price", Number(e.target.value))
              }
            />
          </div>

          <button className="apply-btn" onClick={applyFilters}>
            Apply
          </button>
        </aside>

        <div className="location-search-container">
          {divOpen ? (
            <div className="form-wrapper-show show">
              <form onSubmit={submitHandler}>
                <div className="input-container">
                  <label htmlFor="destination">
                    {" "}
                    Destination :
                    <input
                      type="text"
                      id="destination"
                      value={formData.destination}
                      onChange={formHandler}
                    />
                  </label>
                </div>
                <div className="date-container">
                  <div className="check-in-container">
                    <label>
                      Check-in :
                      <input
                        id="checkIn"
                        type="date"
                        value={formData.checkIn}
                        onChange={formHandler}
                      />
                    </label>
                  </div>
                  <div className="check-out-container">
                    <label>
                      Check-out :
                      <input
                        type="date"
                        id="checkOut"
                        value={formData.checkOut}
                        onChange={formHandler}
                      />
                    </label>
                  </div>
                </div>
                <div className="peopleCount">
                  <label>
                    Adults :
                    <input
                      type="number"
                      id="people"
                      value={formData.people}
                      onChange={formHandler}
                    />
                  </label>
                </div>
                <div className="submit-container">
                  <button type="button" onClick={() => setDivopen(!divOpen)}>
                    cancel
                  </button>
                  <button type="submit">Search</button>
                </div>
              </form>
            </div>
          ) : (
            <div
              className="selected-loaction-container"
              onClick={() => setDivopen(!divOpen)}
            >
              <div className="destination">{id}</div>
              <div className="dates-container">
                <div className="check-in">{checkIn}</div>
                <div className="check-out">{checkOut}</div>
              </div>
              <div className="count">{people}</div>
            </div>
          )}
          <div className="hotels-blog-container">
            {loading ? (
              <p>Loading the hotels....</p>
            ) : (filteredHotels.length > 0 ? filteredHotels : hotels).length ===
              0 ? (
              <p>No hotels found for this location and dates.</p>
            ) : (
              (filteredHotels.length > 0 ? filteredHotels : hotels).map(
                (hotel, index) => (
                  <Hotel_Blog
                    key={index}
                    hotel={hotel}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    people={people}
                  />
                )
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
