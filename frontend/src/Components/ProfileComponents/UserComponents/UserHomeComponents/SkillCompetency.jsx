import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";

const SkillCompetency = ( {userId} ) => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  console.log(userId);
  
  useEffect(() => {
    const fetchData = async () => {
      let endpoint = `http://localhost:8000/user/get-user-skills`;
      if (userId) {
        endpoint = `http://localhost:8000/data/get-user-skills/${userId}`;
      }
      const token = localStorage.getItem("token");
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
    const beginnerSkills = data.filter((skill) => skill.competency === "Beginner").length;
    const intermediateSkills = data.filter((skill) => skill.competency === "Intermediate").length;
    const advancedSkills = data.filter((skill) => skill.competency === "Advanced").length;

    const output = {
      labels: ["Beginner", "Intermediate", "Advanced"],
      datasets: [
        {
          label: "Skill Levels",
          data: [beginnerSkills, intermediateSkills, advancedSkills],
          backgroundColor: ["#06bee1", "#f4a261", "#5949f4"], // Aero, orange, Majorelle Blue
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Skill Level",
          },
        },
        y: {
          title: {
            display: true,
            text: "Number of Skills",
          },
          beginAtZero: true,
        },
      },
    };

    setChartData(output);
    setChartOptions(options);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: "#5949f4" }}>
        Skill Competency Levels
      </h2>

      {chartData ? (
        <Chart type="bar" data={chartData} options={chartOptions} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default SkillCompetency;
