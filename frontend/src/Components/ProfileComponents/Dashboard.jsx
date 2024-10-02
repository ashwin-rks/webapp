import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../UIComponents/Navbar";
import Sidebar from "../UIComponents/Sidebar";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="content-wrapper">
        <Navbar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
