import React, { useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker } from "@peacechen/google-maps-react";
import bicycleIcon from "../images/bicycle.png";
import axios from "axios";

const Current_user_map = ({ google, rideId }) => {
  const [rideLocation, setRideLocation] = useState(null);

  const fetchCurrentLocation = async () => {
    try {
      const response = await axios.get(
        `https://backend-host-9thd.onrender.com/api/v1/ride/${rideId}/currentLocation`
      );
      setRideLocation(response.data);
    } catch (error) {
      console.error("Error fetching current location:", error);
    }
  };

  useEffect(() => {
    if (rideId) {
      fetchCurrentLocation();
    }
  }, [rideId]);

  return (
    <div>
      <Map
        google={google}
        style={{ width: "35.7%", height: "55%" }}
        zoom={15}
        initialCenter={{
          lat: rideLocation ? rideLocation.latitude : 6.04717, // Fallback value
          lng: rideLocation ? rideLocation.longitude : 80.210091, // Fallback value
        }}
        center={{
          lat: rideLocation ? rideLocation.latitude : 6.04717, // Update center dynamically
          lng: rideLocation ? rideLocation.longitude : 80.210091, // Update center dynamically
        }}
      >
        {rideLocation && (
          <Marker
            position={{
              lat: rideLocation.latitude,
              lng: rideLocation.longitude,
            }}
            title={`Current Location: Latitude: ${rideLocation.latitude}, Longitude: ${rideLocation.longitude}, Timestamp: ${rideLocation.timestamp}`}
            icon={{
              url: bicycleIcon,
              scaledSize: new window.google.maps.Size(40, 40), // Set the size of the image
            }}
          />
        )}
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyBRIOBv7RD1nfT3AkqPOtyJ0z7pHt68Ic0",
})(Current_user_map);
