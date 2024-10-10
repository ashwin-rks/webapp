import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";
import Select from "react-select";

const CourseDepartment = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [courses, setCourses] = useState([]); 
  const [selectedCourses, setSelectedCourses] = useState([]); 

  const allOption = { value: "*", label: "All Courses" };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:8000/data/get-course-department",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data;
        setData(responseData);

        const courseSet = new Set();
        responseData.forEach((dept) => {
          dept.courses.forEach((course) => {
            courseSet.add(course.courseName);
          });
        });

        const courseOptions = Array.from(courseSet).map((course) => ({
          value: course,
          label: course,
        }));

        setCourses([allOption, ...courseOptions]);

        // Select top 5 courses for initial state
        const topCourses = courseOptions.slice(0, 5);
        setSelectedCourses(topCourses); // Set initially selected courses

        // Generate chart data based on the top 5 courses
        generateChartData(responseData, topCourses.map((option) => option.value));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateChartData = (data, selectedCourseNames) => {
    const filteredData = [];

    data.forEach((dept) => {
      const departmentLabel = dept.departmentName;
      const departmentCourses = dept.courses.filter((course) =>
        selectedCourseNames.includes(course.courseName)
      );

      if (departmentCourses.length > 0) {
        filteredData.push({ departmentLabel, departmentCourses });
      }
    });

    const output = {
      labels: selectedCourseNames, 
      datasets: [],
    };

    filteredData.forEach((dept) => {
      const departmentData = Array(output.labels.length).fill(0);

      dept.departmentCourses.forEach((course) => {
        const index = output.labels.indexOf(course.courseName);
        if (index !== -1) {
          departmentData[index] = course.enrolledUsers;
        }
      });

      output.datasets.push({
        type: "bar",
        label: dept.departmentLabel,
        data: departmentData,
      });
    });

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    };

    setChartData(output);
    setChartOptions(options);
  };

  const handleCourseChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === allOption.value)) {
      setSelectedCourses([allOption, ...courses.slice(1)]); 
      generateChartData(data, courses.slice(1).map((course) => course.value)); 
    } else {
      setSelectedCourses(selectedOptions);
      const selectedCourseNames = selectedOptions.map((option) => option.value);
      generateChartData(data, selectedCourseNames);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: "#5949f4" }}>
        Users Enrolled by Course
      </h2>

      <Select
        isMulti
        options={courses}
        value={selectedCourses}
        onChange={handleCourseChange}
        className="mb-4"
        placeholder="Select Course(s)"
        closeMenuOnSelect={false}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "#5949f4",
            primary25: "#e6e6fa",
          },
        })}
      />

      {chartData ? (
        <Chart type="bar" data={chartData} options={chartOptions} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default CourseDepartment;
