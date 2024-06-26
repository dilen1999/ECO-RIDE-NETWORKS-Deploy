import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import QrCodeGenerator from "./QrCodeGenerator";
import "./Addbike.css";

function Addbike() {
  const [qrcode, setQrcode] = useState(false);
  const [addbike, setAddbike] = useState({
    brand: "",
    bikeModel: "",
    color: "",
    bikeCode: "",
    initStationId: "",
  });

  const navigate = useNavigate();
  const [latestBikeId, setLatestBikeId] = useState("");
  const [newBikeDetails, setNewBikeDetails] = useState(null); // State to store new bike details

  useEffect(() => {
    const fetchLatestBikeId = async () => {
      try {
        const response = await axios.get(
          "https://backend-host-9thd.onrender.com/api/v1/Bikes/latestBikeId"
        );
        setLatestBikeId(response.data);
      } catch (error) {
        console.error("Error fetching latest bike ID:", error);
      }
    };

    fetchLatestBikeId();
  }, []);

  const onInputChange = (e) => {
    setAddbike({ ...addbike, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const isEmptyField = Object.values(addbike).some((value) => !value);

    if (isEmptyField) {
      alert("Please fill in all the fields");
      return;
    }

    try {
      const requestData = {
        bike: {
          brand: addbike.brand,
          bikeModel: addbike.bikeModel,
          bikeCode: addbike.bikeCode,
          color: addbike.color,
        },
        initStationId: addbike.initStationId,
      };

      await axios.post("https://backend-host-9thd.onrender.com/api/v1/Bikes", requestData);
      console.log(requestData);
      setNewBikeDetails({
        bikeId: latestBikeId + 1,
        ...requestData.bike,
        initStationId: requestData.initStationId,
      });

      setQrcode(true);
      Swal.fire({
        icon: 'success',
        title: 'Bike added successfully!',
        showConfirmButton: false,
        timer: 1500
      });

    } catch (error) {
      console.error("Error adding bike:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error adding bike!'
      });
    }
  };

  return (
    <div className="addbikeboxbike">
      <div className="addbike-text">
        Add your bike details in here
        <form onSubmit={onSubmit}>
          <div className="bike-format">
            <text className="addbiketextwidth">Bike ID</text>
            <text className="addbiketextwidth12">:</text>
            <text>{latestBikeId + 1}</text>
          </div>
          <div className="bike-format">
            <text className="addbiketextwidth">Bike brand</text>
            <text className="addbiketextwidth12">:</text>
            <input
              className="addbikeinput"
              placeholder="bike brand here"
              name="brand"
              value={addbike.brand}
              onChange={onInputChange}
            />
          </div>
          <div className="bike-format">
            <text className="addbiketextwidth">Bike model</text>
            <text className="addbiketextwidth12">:</text>
            <input
              className="addbikeinput"
              placeholder="bike model here"
              name="bikeModel"
              value={addbike.bikeModel}
              onChange={onInputChange}
            />
          </div>
          <div className="bike-format">
            <text className="addbiketextwidth">Bike code No</text>
            <text className="addbiketextwidth12">:</text>
            <input
              className="addbikeinput"
              placeholder="bike code no here"
              name="bikeCode"
              value={addbike.bikeCode}
              onChange={onInputChange}
            />
          </div>
          <div className="bike-format">
            <text className="addbiketextwidth">Bike color</text>
            <text className="addbiketextwidth12">:</text>
            <input
              className="addbikeinput"
              placeholder="bike color here"
              name="color"
              value={addbike.color}
              onChange={onInputChange}
            />
          </div>
          <div className="bike-format">
            <text className="addbiketextwidth">Station Id</text>
            <text className="addbiketextwidth12">:</text>
            <input
              className="addbikeinput"
              placeholder="ST1"
              name="initStationId"
              value={addbike.initStationId}
              onChange={onInputChange}
            />
          </div>
          <div style={{ display: "flex", direction: "row" }}>
            <button type="submit" className="addbikepagebutton">
              Add bike
            </button>
            <Link to="/homepage" className="cancelbikepagebutton">
              Cancel
            </Link>
          </div>
        </form>
      </div>
      {qrcode && (
        <div className="QrWindow">
          <QrCodeGenerator
            bikeDetails={newBikeDetails}
            handleQrWindowClose={() => setQrcode(false)}
          />
        </div>
      )}
    </div>
  );
}

export default Addbike;
