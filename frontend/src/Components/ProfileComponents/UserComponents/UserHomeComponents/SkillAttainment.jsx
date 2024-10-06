import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";

const SkillAttainment = ({ userId }) => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      let endpoint = 'http://localhost:8000/user/get-user-skills';
      if (userId) {
        endpoint = `http://localhost:8000/data/get-user-skills/${userId}`;
      }
      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData = response.data;

        generateChartData(responseData);
      } catch (error) {
        console.error("Error fetching skills data", error);
      }
    };

    fetchData();
  }, []);

  const generateChartData = (data) => {
    const attainedSkills = data.filter((skill) => skill.competency !== null).length;
    const notAttainedSkills = data.length - attainedSkills;

    const output = {
      labels: ["Attained", "Not Attained"],
      datasets: [
        {
          data: [attainedSkills, notAttainedSkills],
          backgroundColor: ["#06bee1", "#5949f4"], 
          hoverBackgroundColor: ["#06bee1", "#5949f4"],
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#333",
          },
        },
      },
    };

    setChartData(output);
    setChartOptions(options);
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4" style={{ color: "#5949f4" }}>
        Skill Attainment Overview
      </h2>

      {chartData ? (
        <Chart type="doughnut" data={chartData} options={chartOptions} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default SkillAttainment;
