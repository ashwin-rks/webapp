import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";
import Select from "react-select";

const UserGrowthDept = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  // Define the "All Departments" option
  const allOption = { value: "*", label: "All Departments" };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:8000/data/get-department-users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data;
        setData(responseData);

        // Create department options for react-select
        const departmentOptions = responseData.map((dept) => ({
          value: dept.departmentName,
          label: dept.departmentName,
        }));

        // Add "All Departments" option to the list
        setDepartments([allOption, ...departmentOptions]);

        // Initially select all departments and generate chart data
        setSelectedDepartments([allOption, ...departmentOptions]);
        generateChartData(
          responseData,
          departmentOptions.map((option) => option.value)
        );
      } catch (error) {
        console.error("Error fetching department user data", error);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to generate chart data
  const generateChartData = (data, selectedDeptNames) => {
    // Filter data based on selected departments
    const filteredData = data.filter((dept) =>
      selectedDeptNames.includes(dept.departmentName)
    );

    const departmentNames = filteredData.map((dept) => dept.departmentName);
    const userCounts = filteredData.map((dept) => dept.userCount);

    const output = {
      labels: departmentNames,
      datasets: [
        {
          label: "User Count by Department",
          backgroundColor: "#06bee1", // Aero color for bars
          data: userCounts,
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
            text: "Departments",
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

  // Handle department selection change
  const handleDepartmentChange = (selectedOptions) => {
    // If "All Departments" is selected, display all departments
    if (selectedOptions.some((option) => option.value === allOption.value)) {
      setSelectedDepartments([allOption, ...departments.slice(1)]); // Select all departments
      generateChartData(
        data,
        departments.slice(1).map((dept) => dept.value)
      ); // Generate chart for all
    } else {
      setSelectedDepartments(selectedOptions);
      const selectedDeptNames = selectedOptions.map((option) => option.value);
      generateChartData(data, selectedDeptNames);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: "#5949f4" }}>
        User Count by Department
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
            primary: "#5949f4", // Majorelle blue
            primary25: "#e6e6fa", // Light blue hover
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

export default UserGrowthDept;
