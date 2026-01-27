import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const MapWithAddress = ({ lat, lng, hotel }) => {
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await axios.get("/api/location/geocode", {
          params: { lat, lng },
        });
        setAddress(res.data.address);
      } catch (err) {
        console.error(err);
        setAddress("Error fetching address");
      }
    };
    fetchAddress();

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLatLng);

          // Fetch route from OSRM
          fetch(
            `https://router.project-osrm.org/route/v1/driving/${userLatLng.lng},${userLatLng.lat};${lng},${lat}?overview=full&geometries=geojson`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.routes && data.routes.length > 0) {
                const coords = data.routes[0].geometry.coordinates.map(
                  ([lng, lat]) => ({
                    lat,
                    lng,
                  })
                );
                setRouteCoords(coords);
              }
            })
            .catch((err) => console.error(err));
        },
        (err) => console.error(err)
      );
    }
  }, [lat, lng]);

  return (
    <div>
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        style={{ height: "650px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={[lat, lng]}>
          <Popup>{address || "Loading address..."}</Popup>
        </Marker>

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Your location</Popup>
          </Marker>
        )}

        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" />
        )}
      </MapContainer>

      <p style={{ textAlign: "center" }}>Hotel Address: {hotel.city}</p>
    </div>
  );
};

export default MapWithAddress;
