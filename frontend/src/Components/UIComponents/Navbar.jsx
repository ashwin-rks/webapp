import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import LogoSVG from "../../imgs/logo.svg";
import "./navbar.css";


const Navbar = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Left Side: Logo and Company Name */}
        <div className="d-flex align-items-center me-auto">
          <img src={LogoSVG} alt="Company Logo" className="logo" />
          <span className="ms-2 fs-2 fw-bold fontColor">Skill Assessment</span>
        </div>

        {/* Right Side: User Icon and Dropdown */}
        <div className="d-flex align-items-center">
          <FaUserCircle size={30} className="me-2" />
          <Dropdown>
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              className="dropdown-toggle"
            >
              {userName || "User"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/home">Profile</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>
                  Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
