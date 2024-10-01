import React from 'react';
import Navbar from '../UIComponents/Navbar';
import Sidebar from '../UIComponents/Sidebar';
import './dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="content-wrapper">
        <Navbar />
        <div className="main-content">

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
