import React, { useEffect, useState } from "react";
import "./Report.css";
import { Line } from "react-chartjs-2";
import axios from "axios";

function Report1() {
  const [todayDate, setTodayDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [totalIncome, setTotalIncome] = useState(0); // State for total income
  const [monthlyIncome, setMonthlyIncome] = useState(0); // State for monthly income
  const [dailyRevenueData, setDailyRevenueData] = useState([]); // State for daily revenue data
  const [yesterdayRevenue, setYesterdayRevenue] = useState(0); // State for yesterday's revenue
  const [dayBeforeYesterdayRevenue, setDayBeforeYesterdayRevenue] = useState(0); // State for day before yesterday's revenue
  const [twoDaysBeforeRevenue, setTwoDaysBeforeRevenue] = useState(0); // State for two days before revenue

  useEffect(() => {
    const currentDate = new Date();
    setTodayDate(getFormattedDate(currentDate));
    setCurrentMonth(getCurrentMonthName(currentDate));
    loadTotalIncome();
    loadMonthlyIncome(currentDate.getFullYear(), currentDate.getMonth() + 1);
    loadDailyRevenueData(currentDate); // load daily revenue data for the current month
    loadPastDailyRevenueData(currentDate); // load revenue data for past dates
  }, []);

  const getFormattedDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const getCurrentMonthName = (date) => {
    const options = { month: "long" };
    return date.toLocaleDateString("en-US", options);
  };

  const loadTotalIncome = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      const response = await axios.get(`https://backend-host-9thd.onrender.com/api/v1/userpayment/total?date=${today}`);
      setTotalIncome(response.data.totalEstimatedAmount || 0); // Ensure it defaults to 0 if null
    } catch (error) {
      console.error("Error loading total income:", error);
    }
  };

  const loadMonthlyIncome = async (year, month) => {
    try {
      const response = await axios.get(`https://backend-host-9thd.onrender.com/api/v1/userpayment/monthlySum?year=${year}&month=${month}`);
      setMonthlyIncome(response.data || 0); // Ensure it defaults to 0 if null
    } catch (error) {
      console.error("Error loading monthly income:", error);
    }
  };

  const loadDailyRevenueData = async (currentDate) => {
    try {
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const promises = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        promises.push(axios.get(`https://backend-host-9thd.onrender.com/api/v1/userpayment/dailySum?date=${date}`));
      }

      const responses = await Promise.all(promises);
      const dailyData = responses.map((response, index) => ({
        label: (index + 1).toString(),
        revenue: response.data || 0, // Ensure it defaults to 0 if null
        cost: (response.data || 0) * 0.5 // assuming cost is 50% of revenue, replace this with your actual calculation
      }));

      setDailyRevenueData(dailyData);
    } catch (error) {
      console.error("Error loading daily revenue data:", error);
    }
  };

  const loadPastDailyRevenueData = async (currentDate) => {
    try {
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
      const dayBeforeYesterday = new Date(currentDate);
      dayBeforeYesterday.setDate(currentDate.getDate() - 2);
      const twoDaysBefore = new Date(currentDate);
      twoDaysBefore.setDate(currentDate.getDate() - 3);

      const yesterdayResponse = await axios.get(`https://backend-host-9thd.onrender.com/api/v1/userpayment/dailySum?date=${getFormattedDateString(yesterday)}`);
      const dayBeforeYesterdayResponse = await axios.get(`https://backend-host-9thd.onrender.com/api/v1/userpayment/dailySum?date=${getFormattedDateString(dayBeforeYesterday)}`);
      const twoDaysBeforeResponse = await axios.get(`https://backend-host-9thd.onrender.com/api/v1/userpayment/dailySum?date=${getFormattedDateString(twoDaysBefore)}`);

      setYesterdayRevenue(yesterdayResponse.data || 0); // Ensure it defaults to 0 if null
      setDayBeforeYesterdayRevenue(dayBeforeYesterdayResponse.data || 0); // Ensure it defaults to 0 if null
      setTwoDaysBeforeRevenue(twoDaysBeforeResponse.data || 0); // Ensure it defaults to 0 if null
    } catch (error) {
      console.error("Error loading past daily revenue data:", error);
    }
  };

  const getFormattedDateString = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div style={{ width: "100%" }} className="column">
      <div className="Dashboard">
        <div className="dashboardRow">
          <span>Dashboard </span>
          <span>{">"}</span>
          <span> Reports </span>
        </div>
      </div>

      <div>
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              className="StaionDetailsBoxuser"
              style={{ marginLeft: "50px" }}
            >
              <div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="text">Total income</p>
                  <p
                    className="text"
                    style={{ marginLeft: "100px", fontSize: "14px" }}
                  >
                    {todayDate}
                  </p>
                </div>

                <p className="numberuser1" style={{ marginTop: "0px" }}>
                  {totalIncome.toLocaleString()} {/* Display the total income */}
                </p>
              </div>
            </div>
            <div
              className="StaionDetailsBoxuser"
              style={{ marginLeft: "40px" }}
            >
              <div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="text">Total monthly income</p>
                  <p
                    className="text"
                    style={{ marginLeft: "100px", fontSize: "14px" }}
                  >
                    {currentMonth}
                  </p>
                </div>

                <p
                  className="numberuser1"
                  style={{ marginTop: "0px", marginLeft: "100px" }}
                >
                  {monthlyIncome.toLocaleString()} {/* Display the monthly income */}
                </p>
              </div>
            </div>
            <div
              className="StaionDetailsBoxuser"
              style={{ marginLeft: "50px" }}
            >
              <div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="text">Total income Today</p>
                  <p
                    className="text"
                    style={{ marginLeft: "100px", fontSize: "14px" }}
                  >
                    {todayDate}
                  </p>
                </div>

                <p className="numberuser1">{totalIncome.toLocaleString()}</p>
              </div>
            </div>
            <div
              className="StaionDetailsBoxuser"
              style={{ marginLeft: "50px" }}
            >
              <div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="text">Total Cost today</p>
                  <p
                    className="text"
                    style={{ marginLeft: "100px", fontSize: "14px" }}
                  >
                    {todayDate}
                  </p>
                </div>

                <p className="numberuser1">{(totalIncome / 2).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div
            className="reportbackground"
            style={{ display: "flex", flexDirection: "row", marginTop: "50px" }}
          >
            <div
              className="reportStaionDetailsBoxuser"
              style={{ marginLeft: "50px" }}
            >
              <div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="text" style={{ marginRight: "10px" }}>
                    {getFormattedDate(new Date())}
                  </p>
                  {/* <p className="text" style={{ fontSize: "14px", marginLeft:"60px" }}>
                    13 Today
                  </p> */}
                </div>

                <p className="numberuser1" style={{ marginTop: "0px" }}>
                  {totalIncome.toLocaleString()}
                </p>
              </div>
              <div style={{ marginTop: "-150px" }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="text">{getFormattedDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000))}</p>
                </div>

                <p className="numberuser1" style={{ marginTop: "0px" }}>
                  {yesterdayRevenue.toLocaleString()}
                </p>
              </div>
              <div style={{ marginTop: "-150px" }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="text">{getFormattedDate(new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000))}</p>
                </div>

                <p className="numberuser1" style={{ marginTop: "0px" }}>
                  {dayBeforeYesterdayRevenue.toLocaleString()}
                </p>
              </div>
              <div style={{ marginTop: "-150px" }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="text">{getFormattedDate(new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000))}</p>
                </div>

                <p className="numberuser1" style={{ marginTop: "0px" }}>
                  {twoDaysBeforeRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <div style={{ width: "90%", height: "450px", marginLeft: "70px" }}>
              <Line
                data={{
                  labels: dailyRevenueData.map((data) => data.label),
                  datasets: [
                    {
                      label: "Revenue",
                      data: dailyRevenueData.map((data) => data.revenue),
                      backgroundColor: "#63DF08",
                      borderColor: "#63DF08",
                    },
                    {
                      label: "Cost",
                      data: dailyRevenueData.map((data) => data.cost),
                      backgroundColor: "#9B08DF",
                      borderColor: "#9B08DF",
                    },
                  ],
                }}
                options={{
                  scales: {
                    x: {
                      type: "category",
                      labels: dailyRevenueData.map((data) => data.label),
                    },
                    y: {
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    title: { display: true, text: "Daily Revenue & Cost" },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report1;
