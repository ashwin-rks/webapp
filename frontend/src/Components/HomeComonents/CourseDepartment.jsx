import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";
import Select from "react-select";

const CourseDepartment = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]); // Store selected departments

  // Define the "All Departments" option
  const allOption = { value: "*", label: "All Departments" };

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

        const departmentOptions = responseData.map((dept) => ({
          value: dept.departmentName,
          label: dept.departmentName,
        }));
        setDepartments([allOption, ...departmentOptions]); // Add "All Departments" option to the top

        // Initially select all departments
        generateChartData(responseData, departmentOptions.map((option) => option.value));
        setSelectedDepartments([allOption, ...departmentOptions]);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate chart data based on selected departments
  const generateChartData = (data, selectedDeptNames) => {
    const filteredData = data.filter((dept) =>
      selectedDeptNames.includes(dept.departmentName)
    );

    const courseNames = new Set();
    filteredData.forEach((dept) => {
      dept.courses.forEach((course) => {
        courseNames.add(course.courseName);
      });
    });

    const output = {
      labels: Array.from(courseNames),
      datasets: [],
    };

    filteredData.forEach((dept) => {
      const departmentLabel = dept.departmentName;
      const departmentData = Array(output.labels.length).fill(0);

      dept.courses.forEach((course) => {
        const index = output.labels.indexOf(course.courseName);
        if (index !== -1) {
          departmentData[index] = course.enrolledUsers;
        }
      });

      output.datasets.push({
        type: "bar",
        label: departmentLabel,
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

  // Handle department selection change
  const handleDepartmentChange = (selectedOptions) => {
    // If "All Departments" is selected, display all departments
    if (selectedOptions.some((option) => option.value === allOption.value)) {
      setSelectedDepartments([allOption, ...departments.slice(1)]); // Select all departments
      generateChartData(data, departments.slice(1).map((dept) => dept.value)); // Generate chart for all
    } else {
      setSelectedDepartments(selectedOptions);
      const selectedDeptNames = selectedOptions.map((option) => option.value);
      generateChartData(data, selectedDeptNames);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: "#5949f4" }}>
        Courses by Department
      </h2>

      {/* Department filter */}
      <Select
        isMulti
        options={departments}
        value={selectedDepartments}
        onChange={handleDepartmentChange}
        className="mb-4"
        placeholder="Select Department(s)"
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

      {/* Only render the chart when chartData is available */}
      {chartData ? (
        <Chart type="bar" data={chartData} options={chartOptions} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default CourseDepartment;
