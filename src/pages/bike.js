import React, { useEffect, useState } from "react";
import { faBell, faBicycle, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./Bike.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Addbike from "../components/Addbike";
import Bikes_view from "../components/Bikes_view";

function Bike() {
  const [bikes, setBikes] = useState([]);
  const [search, setSearch] = useState("");
  const [currentbikeClicked, setCurrentbikeClicked] = useState(true);
  const [addbikeClicked, setAddbikeClicked] = useState(false);
  const [totalBikes, setTotalBikes] = useState(0);
  const [todayDate, setTodayDate] = useState("");
  const [totalOnRideUsers, setTotalOnRideUsers] = useState([]);
  const [bikesInStation, setBikesInStation] = useState([]);
  const [allRides, setAllRides] = useState([]);
  const [bikeView, setBikeView] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);

  useEffect(() => {
    loadBikes();
    setTodayDate(getFormattedDate(new Date()));
    TotalOnRideUsersfun();
    AllBikesInStations();
    AllRideBikes();
  }, []);

  // Function to format date as "DD MonthName YYYY"
  const getFormattedDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const loadBikes = async () => {
    try {
      const result = await axios.get("https://backend-host-9thd.onrender.com/api/v1/Bikes");
      setTotalBikes(result.data.length);
      setBikes(result.data);
    } catch (error) {
      console.error("Error loading bikes:", error);
      alert("Failed to load bikes. Please try again later.");
    }
  };

  const deleteBikes = async (bike_id) => {
    if (window.confirm("Are you sure you want to delete this bike?")) {
      try {
        await axios.delete(`https://backend-host-9thd.onrender.com/api/v1/Bikes/${bike_id}`);
        loadBikes();
      } catch (error) {
        console.error("Error deleting bike:", error);
        alert("Failed to delete bike. Please try again later.");
      }
    }
  };

  const TotalOnRideUsersfun = async () => {
    try {
      const result = await axios.get("https://backend-host-9thd.onrender.com/api/v1/user/totalonRideUsers");
      setTotalOnRideUsers(result.data);
    } catch (error) {
      console.error("Error fetching total on-ride users:", error);
      alert("Failed to fetch total on-ride users. Please try again later.");
    }
  };

  const AllBikesInStations = async () => {
    try {
      const result = await axios.get("https://backend-host-9thd.onrender.com/api/v1/station/total-available-bikes");
      setBikesInStation(result.data);
    } catch (error) {
      console.error("Error fetching bikes in stations:", error);
      alert("Failed to fetch bikes in stations. Please try again later.");
    }
  };

  const AllRideBikes = async () => {
    try {
      const result = await axios.get("https://backend-host-9thd.onrender.com/api/v1/ride/total");
      setAllRides(result.data);
    } catch (error) {
      console.error("Error fetching all ride bikes:", error);
      alert("Failed to fetch all ride bikes. Please try again later.");
    }
  };

  return (
    <div style={{ width: "100%" }} className="column">
      <div className="Dashboard">
        <div className="dashboardRow">
          <span>Dashboard{">"}</span>
          <span> Bike </span>
        </div>
      </div>

      <div>
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="StaionDetailsBoxuser" style={{ marginLeft: "70px" }}>
              <div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="text">Total bikes</p>
                  <p className="text" style={{ marginLeft: "100px", fontSize: "14px" }}>
                    {todayDate}
                  </p>
                </div>
                <p className="numberuser1">{totalBikes}</p>
              </div>
            </div>
            <div className="StaionDetailsBoxuser">
              <p className="text">Total bikes in stations</p>
              <p className="numberuser">{bikesInStation}</p>
            </div>
            <div className="StaionDetailsBoxuser">
              <p className="text">On-Ride bikes</p>
              <p className="numberuser">{totalOnRideUsers}</p>
            </div>
            <div className="StaionDetailsBoxuser">
              <p className="text">Total ride</p>
              <p className="numberuser">{allRides}</p>
            </div>
          </div>
        </div>
      </div>

      {currentbikeClicked && (
        <div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="current_User">Bikes</div>
            <Link
              className="addbikebutton"
              to=""
              onClick={() => {
                setCurrentbikeClicked(false);
                setAddbikeClicked(true);
              }}
            >
              +Add bike
            </Link>
            <div
              className="bike-Search_User"
              style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
            >
              <FontAwesomeIcon icon={faSearch} style={{ marginRight: "5px" }} />
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                style={{ border: "none", outline: "none", width: "7vw", height: "2vh" }}
              ></input>
            </div>
          </div>
          <div className="table-container">
            <table className="bike-table">
              <thead>
                <tr>
                  <th scope="col">Index</th>
                  <th scope="col">ID</th>
                  <th scope="col">Profile</th>
                  <th scope="col">Brand</th>
                  <th scope="col">Model</th>
                  <th scope="col">Bike code no</th>
                  <th scope="col">Last maintenance date</th>
                  <th scope="col">On ride?</th>
                  <th scope="col">Current user</th>
                  <th scope="col">Current location</th>
                  <th scope="col">Color</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {bikes
                  .filter((Bike) => {
                    return search.toLowerCase() === ""
                      ? Bike
                      : (Bike.brand ? Bike.brand.toLowerCase() : "").includes(search.toLowerCase());
                  })
                  .map((Bike, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{Bike.bikeId}</td>
                      <td>
                        <div>
                          <FontAwesomeIcon icon={faBicycle} style={{ marginRight: "5px" }} />
                        </div>
                      </td>
                      <td>{Bike.brand}</td>
                      <td>{Bike.bikeModel}</td>
                      <td>{Bike.bikeCode}</td>
                      <td>{Bike.lastMaintenanceDate}</td>
                      <td>{Bike.onRide ? "Yes" : "No"}</td>
                      <td>None</td>
                      <td>Galle</td>
                      <td>{Bike.color}</td>
                      <td>
                        <div className="dropdown">
                          <button className="dropbtn">
                            Action <span className="arrow">&#9658;</span>
                          </button>
                          <div className="dropdown-content">
                            <button
                              className="action-button"
                              onClick={() => {
                                setBikeView(true);
                                setSelectedBike(Bike);
                              }}
                            >
                              View
                            </button>
                            <button className="action-button">View location</button>
                            <button className="action-button" onClick={() => deleteBikes(Bike.bikeId)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {bikeView && selectedBike && (
              <div className="QrWindow">
                <Bikes_view
                  handleQrWindowClose={() => setBikeView(false)}
                  selectedBike={selectedBike}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {addbikeClicked && (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <Addbike
              onSuccessAdd={() => {
                setAddbikeClicked(false);
                setCurrentbikeClicked(true);
                loadBikes();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Bike;
