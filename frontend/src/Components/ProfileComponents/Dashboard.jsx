import React from "react";
import Navbar from "../UIComponents/Navbar";
import Sidebar from "../UIComponents/Sidebar";
import "./dashboard.css";
import Departments from "./AdminComponents/Departments";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="content-wrapper">
        <Navbar />
        <div className="main-content">
          <Departments />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
