import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaGraduationCap } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { TfiStatsUp } from "react-icons/tfi";
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
          <Link to="/admin" className="nav-link d-flex align-items-center">
            <FaHome className="icon" />
            <span className="menu-text">Home</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/department" className="nav-link d-flex align-items-center">
            <MdGroups className="icon" />
            <span className="menu-text">Department</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/courses" className="nav-link d-flex align-items-center">
            <FaGraduationCap className="icon" />
            <span className="menu-text">Courses</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/skills" className="nav-link d-flex align-items-center">
            <TfiStatsUp className="icon" />
            <span className="menu-text">Skills</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/profile" className="nav-link d-flex align-items-center">
            <FaUser className="icon" />
            <span className="menu-text">Profile</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
