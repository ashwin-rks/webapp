import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [accountType, setAccountType] = useState(""); // State to hold account type

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.name);
      setAccountType(decodedToken.account_type); // Set account type from decoded token
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light w-100">
      <div className="container-fluid d-flex justify-content-end">
        {/* Profile Dropdown (aligned to the end) */}
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
              <Dropdown.Item as={Link} to={accountType === 'admin' ? "/admin/profile" : "/user/profile"}>
                Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
