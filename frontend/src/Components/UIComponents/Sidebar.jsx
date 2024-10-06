import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { FaHome, FaUser, FaGraduationCap } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { TfiStatsUp } from "react-icons/tfi";
import LogoSVG from "../../imgs/logo.svg"; 
import './sidebar.css';
const Sidebar = () => {
  const [isAdmin, setIsAdmin] = useState(false); 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token); 
      setIsAdmin(decodedToken.account_type === 'admin'); 
    }
  }, []); 

  return (
    <div className="sidebar d-flex flex-column">
      {/* Company Logo and Name */}
      <div className="sidebar-header text-center pb-4">
        <img src={LogoSVG} alt="Company Logo" className="sidebar-logo" />
        <h4 className="company-name">Skill Assessment</h4>
      </div>
      
      <ul className="nav flex-column">
        {/* Admin Sidebar Links */}
        {isAdmin ? (
          <>
            <li className="nav-item">
              <Link to="/admin/home" className="nav-link d-flex align-items-center">
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
              <Link to="/admin/users" className="nav-link d-flex align-items-center">
                <FaUser className="icon" />
                <span className="menu-text">Users</span>
              </Link>
            </li>
          </>
        ) : (
          // User Sidebar Links
          <>
            <li className="nav-item">
              <Link to="/user/home" className="nav-link d-flex align-items-center">
                <FaHome className="icon" />
                <span className="menu-text">Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/user/courses" className="nav-link d-flex align-items-center">
                <FaGraduationCap className="icon" />
                <span className="menu-text">Courses</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/user/skills" className="nav-link d-flex align-items-center">
                <TfiStatsUp className="icon" />
                <span className="menu-text">Skills</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/user/profile" className="nav-link d-flex align-items-center">
                <FaUser className="icon" />
                <span className="menu-text">Profile</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;