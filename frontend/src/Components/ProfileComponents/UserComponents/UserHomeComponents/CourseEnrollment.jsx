import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";

const CourseEnrollment = ({ userId }) => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      let endpoint = `http://localhost:8000/user/get-courses`;
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

        // Generate chart data for course enrollment
        generateChartData(responseData);
      } catch (error) {
        console.error("Error fetching course data", error);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  const generateChartData = (data) => {
    const enrolledCourses = data.filter((course) => course.user_score !== null).length;
    const notEnrolledCourses = data.length - enrolledCourses;

    const output = {
      labels: ["Enrolled", "Not Enrolled"],
      datasets: [
        {
          data: [enrolledCourses, notEnrolledCourses],
          backgroundColor: ["#06bee1", "#5949f4"], // Aero and Majorelle Blue
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
        Course Enrollment Overview
      </h2>

      {chartData ? (
        <Chart type="doughnut" data={chartData} options={chartOptions} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default CourseEnrollment;
