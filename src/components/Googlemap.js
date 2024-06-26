import React, { useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker } from "@peacechen/google-maps-react";
import axios from "axios";
import bicycleIcon from "../images/bicycle.png";

const MapContainer = (props) => {
  const [ridePaths, setRidePaths] = useState([]);

  // Function to fetch active ride paths from the backend
  const fetchActiveRidePaths = async () => {
    try {
      const response = await axios.get(
        "https://backend-host-9thd.onrender.com/api/v1/ride/activeRidePaths"
      );
      setRidePaths(response.data);
    } catch (error) {
      console.error("Error fetching active ride paths:", error);
    }
  };

  // Fetch ride paths on component mount
  useEffect(() => {
    fetchActiveRidePaths();
  }, []);

  // const cycleIcon = {
  //   url: "https://img.pngwing.com/pngs/582/77/png-transparent-bicycle-icons-pedaler-cyclist-cycling-cycling-sport-sports-equipment-thumbnail.png", // Replace with your icon URL
  //   scaledSize: new window.google.maps.Size(30, 30),
  //   origin: new window.google.maps.Point(0, 0),
  //   anchor: new window.google.maps.Point(15, 30)
  // };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Map
        google={props.google}
        zoom={15}
        initialCenter={{
          lat: 6.03484,
          lng: 80.220073,
        }}
        style={{ width: "76.5%", height: "80%" }}
      >
        <Marker position={{ lat: 6.0367, lng: 80.217 }} />
        <Marker position={{ lat: 6.035, lng: 80.226 }} />
        <Marker position={{ lat: 6.0298, lng: 80.2174 }} />
        <Marker position={{ lat: 6.0362, lng: 80.2156 }} />

        {ridePaths.map((path, index) => (
          <Marker
            key={index}
            position={{ lat: path.latitude, lng: path.longitude }}
            title={`Ride ID: ${path.rideId}, Timestamp: ${path.timestamp}`}
            icon={{
              url: bicycleIcon,
              scaledSize: new window.google.maps.Size(40, 40), // Set the size of the image
            }}
            // icon={cycleIcon}
          />
        ))}
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyBRIOBv7RD1nfT3AkqPOtyJ0z7pHt68Ic0",
})(MapContainer);
