import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";

const CourseScores = ({ userId }) => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      let endpoint = "http://localhost:8000/user/get-courses";
      if (userId) {
        endpoint = `http://localhost:8000/data/get-courses/${userId}`;
      }

      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData = response.data;

        // Generate chart data for course scores
        generateChartData(responseData);
      } catch (error) {
        console.error("Error fetching course data", error);
      }
    };

    fetchData();
  }, [userId]); // Include userId as a dependency

  const generateChartData = (data) => {
    const enrolledCourses = data.filter((course) => course.user_score !== null);
    
    // Sort courses by score in descending order and slice the top 5
    const topCourses = enrolledCourses
      .sort((a, b) => b.user_score - a.user_score)
      .slice(0, 5);
    
    const courseNames = topCourses.map((course) => course.course_name);
    const courseScores = topCourses.map((course) => course.user_score);

    const output = {
      labels: courseNames,
      datasets: [
        {
          label: "Course Scores",
          data: courseScores,
          backgroundColor: "#5949f4", // Aero color
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
            text: "Courses",
          },
        },
        y: {
          title: {
            display: true,
            text: "Scores",
          },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
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
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: "#5949f4" }}>
        Course Scores Overview
      </h2>

      {chartData ? (
        <Chart type="bar" data={chartData} options={chartOptions} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default CourseScores;
