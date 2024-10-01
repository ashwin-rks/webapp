import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaCog, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import LogoSVG from "../../imgs/logo.svg"; // Ensure you have the logo
import './sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar d-flex flex-column">
      {/* Company Logo and Name */}
      <div className="sidebar-header text-center pb-4">
        <img src={LogoSVG} alt="Company Logo" className="sidebar-logo" />
        <h4 className="company-name">Skill Assessment</h4>
      </div>
      
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/home" className="nav-link d-flex align-items-center">
            <FaHome className="icon" />
            <span className="menu-text">Home</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile" className="nav-link d-flex align-items-center">
            <FaUser className="icon" />
            <span className="menu-text">Profile</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/settings" className="nav-link d-flex align-items-center">
            <FaCog className="icon" />
            <span className="menu-text">Settings</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link d-flex align-items-center">
            <FaInfoCircle className="icon" />
            <span className="menu-text">About</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/contact" className="nav-link d-flex align-items-center">
            <FaEnvelope className="icon" />
            <span className="menu-text">Contact</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
