import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Chart } from "primereact/chart";
import TableV from "../../../UIComponents/TableV";

const DepartmentView = () => {
  const { deptId } = useParams();
  const [departmentUsers, setDepartmentUsers] = useState([]);
  const [avgMarks, setAvgMarks] = useState([]);
  const [userSkills, setUserSkills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const usersResponse = await axios.get(
          `http://localhost:8000/data/get-department-users/${deptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDepartmentUsers(usersResponse.data);

        const avgMarksResponse = await axios.get(
          `http://localhost:8000/data/get-avgmarks-courses/${deptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAvgMarks(avgMarksResponse.data);

        const userSkillsResponse = await axios.get(
          `http://localhost:8000/data/get-user-skill-dept/${deptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserSkills(userSkillsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [deptId]);

  const generateAvgMarksChartData = (data) => {
    return {
      labels: data.map((item) => item.course_name),
      datasets: [
        {
          label: "Average Marks",
          backgroundColor: "#5949f4", // Majorelle Blue
          hoverBackgroundColor: "#06bee1", // Aero
          data: data.map((item) => item.average_score),
        },
      ],
    };
  };

  const generateUserSkillsChartData = (data) => {
    return {
      labels: data.map((item) => item.skill_name),
      datasets: [
        {
          label: "Number of Users",
          backgroundColor: "#06bee1", // Aero
          hoverBackgroundColor: "#5949f4", // Majorelle Blue
          data: data.map((item) => item.user_count),
        },
      ],
    };
  };

  const chartOptions = {
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
    scales: {
      x: {
        ticks: {
          color: "#333",
        },
      },
      y: {
        ticks: {
          color: "#333",
        },
      },
    },
  };

  return (
    <div className="container-fluid w-100">
      <div className="row">
        <div className="col-12 mb-4">
          <h3 className="p-0 fontColor">Department Details</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-lg-6">
          <h4>Average Marks</h4>
          {avgMarks.length > 0 ? (
            <Chart
              type="bar"
              data={generateAvgMarksChartData(avgMarks)}
              options={chartOptions}
            />
          ) : (
            <p>No Course Marks Found yet...</p>
          )}
        </div>

        <div className="col-12 col-lg-6">
          <h4>User Skills</h4>
          {userSkills.length > 0 ? (
            <Chart
              type="bar"
              data={generateUserSkillsChartData(userSkills)}
              options={chartOptions}
            />
          ) : (
            <p>No User Skills Found yet...</p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <TableV tableData={departmentUsers} />
        </div>
      </div>
    </div>
  );
};

export default DepartmentView;
