import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";

const UserGrowth = () => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:8000/data/get-user-growth",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data;

        // Generate chart data
        generateChartData(responseData);
      } catch (error) {
        console.error("Error fetching user growth data", error);
      }
    };

    fetchData();
  }, []);

  // Generate chart data for user growth
  const generateChartData = (data) => {
    // Extract months and user counts
    const months = data.map((item) => item.month);
    const userCounts = data.map((item) => item.userCount);

    const output = {
      labels: months,
      datasets: [
        {
          label: "User Growth Over Time",
          data: userCounts,
          fill: false,
          borderColor: "#06bee1", // Line color (aero)
          tension: 0.4, // Smooth line
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      scales: {
        x: {
          title: {
            display: true,
            text: "Months",
          },
        },
        y: {
          title: {
            display: true,
            text: "User Count",
          },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    };

    setChartData(output);
    setChartOptions(options);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: "#5949f4" }}>
        User Growth Over Time
      </h2>

      {chartData ? (
        <Chart type="line" data={chartData} options={chartOptions} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default UserGrowth;
