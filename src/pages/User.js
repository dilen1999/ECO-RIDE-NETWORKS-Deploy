import React, { useEffect, useState } from "react";
import "./Bike.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import User_view from "../components/User_view";

function User() {
  const [user, setUser] = useState([]);
  const [searchu, setSearchu] = useState("");
  const [totalBikes, setTotalBikes] = useState(0);
  const [totalNewUsers, setTotalNewUsers] = useState(0);
  const [totalOnRideUsers, setTotalOnRideUsers] = useState(0);
  const [todayDate, setTodayDate] = useState("");
  const [allRides, setAllRides] = useState(0);
  const [totalCurrentUsers, setTotalCurrentUsers] = useState(0);

  const [userView, setUserView] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
    loadTotalNewUsers();
    loadTotalOnRideUsers();
    setTodayDate(getFormattedDate(new Date()));
    loadAllRideBikes();
    loadCurrentUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const result = await axios.get("https://backend-host-9thd.onrender.com/api/v1/user/all");
      setUser(result.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadCurrentUsers = async () => {
    try {
      const result = await axios.get("https://backend-host-9thd.onrender.com/api/v1/user/inRide");
      setTotalCurrentUsers(result.data.length);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadTotalNewUsers = async () => {
    try {
      const result = await axios.get("https://backend-host-9thd.onrender.com/api/v1/user/totalVerifiedUsers");
      setTotalNewUsers(result.data);
    } catch (error) {
      console.error("Error loading total new users:", error);
    }
  };

  const loadTotalOnRideUsers = async () => {
    try {
      const result = await axios.get("https://backend-host-9thd.onrender.com/api/v1/user/totalonRideUsers");
      setTotalOnRideUsers(result.data);
    } catch (error) {
      console.error("Error loading total on-ride users:", error);
    }
  };

  const loadAllRideBikes = async () => {
    try {
      const result = await axios.get("https://backend-host-9thd.onrender.com/api/v1/ride/total");
      setAllRides(result.data);
    } catch (error) {
      console.error("Error loading all ride bikes:", error);
    }
  };

  const getFormattedDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString)
      .toLocaleDateString("en-GB", options)
      .split("/")
      .reverse()
      .join("-");
  };

  return (
    <div style={{ width: "100%" }} className="column">
      <div className="Dashboard">
        <div className="dashboardRow">
          <span>Dashboard </span>
          <span>{">"}</span>
          <span> Users </span>
        </div>
      </div>

      <div>
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="StaionDetailsBoxuser" style={{ marginLeft: "70px" }}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="text">Total users</p>
                <p className="text" style={{ marginLeft: "100px", fontSize: "14px" }}>
                  {todayDate}
                </p>
              </div>
              <p className="numberuser1">{user.length}</p>
            </div>
            <div className="StaionDetailsBoxuser">
              <p className="text">Total current users</p>
              <p className="numberuser">{totalCurrentUsers}</p>
            </div>
            <div className="StaionDetailsBoxuser">
              <p className="text">On-Ride users</p>
              <p className="numberuser">{totalOnRideUsers}</p>
            </div>
            <div className="StaionDetailsBoxuser">
              <p className="text">Total ride</p>
              <p className="numberuser">{allRides}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="current_User">User</div>
            <div
              className="bike-Search_Useruser"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon icon={faSearch} style={{ marginRight: "5px" }} />
              <input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearchu(e.target.value)}
                style={{ border: "none", outline: "none", width: "120px" }}
              ></input>
            </div>
          </div>
          <div className="table-container">
            <table className="bike-table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Profile</th>
                  <th scope="col">Firstname</th>
                  <th scope="col">Lastname</th>
                  <th scope="col">Email</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Registed date</th>
                  <th scope="col">On ride?</th>
                  <th scope="col">Current location</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {user
                  .filter((User) => {
                    if (!searchu) return true;
                    return (
                      User.firstName.toLowerCase().includes(searchu.toLowerCase()) ||
                      User.lastName.toLowerCase().includes(searchu.toLowerCase())
                    );
                  })
                  .map((User, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="profile-circle"></div>
                      </td>
                      <td>{User.firstName}</td>
                      <td>{User.lastName}</td>
                      <td>{User.email}</td>
                      <td>{User.mobile}</td>
                      <td>{formatDate(User.registrationTime)}</td>
                      <td>{User.inRide ? "Yes" : "No"}</td>
                      <td>
                        {/* Render location details */}
                        {User.location 
                          ? `${User.location.latitude}, ${User.location.longitude}` 
                          : "N/A"
                        }
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            onClick={() => {
                              setUserView(true);
                              setSelectedUser(User);
                            }}
                            className="dropbtn"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {userView && selectedUser && (
              <div className="QrWindow">
                <User_view
                  handleQrWindowClose={() => setUserView(false)}
                  selectedUser={selectedUser}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
