import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../styles.css";
import "./authStyles.css";

const Signup = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [credentials, setCredentials] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    account_type: "",
  });
  const [errors, setErrors] = useState({});
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // Handles the login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // Checks for errors in Email field
    if (!credentials.email.trim()) {
      newErrors = {
        ...newErrors,
        email: "Email is required!",
      };
    } else if (!emailRegex.test(credentials.email.trim())) {
      newErrors = {
        ...newErrors,
        email: "Enter a valid email!",
      };
    }

    // Checks for errors in Password field
    if (!credentials.password.trim()) {
      newErrors = {
        ...newErrors,
        password: "Password is required!",
      };
    }

    if (!credentials.account_type.trim()) {
      newErrors = {
        ...newErrors,
        account_type: "Account type is required!",
      };
    }

    if (!credentials.first_name.trim()) {
      newErrors = {
        ...newErrors,
        first_name: "First Name is required!",
      };
    }

    if (!credentials.last_name.trim()) {
      newErrors = {
        ...newErrors,
        last_name: "Last Name is required!",
      };
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const first_name = credentials.first_name;
      const last_name = credentials.last_name;
      const account_type = credentials.account_type;
      const email = credentials.email;
      const password = credentials.password;

      try {
        const response = await axios.post("http://localhost:8000/auth/signup", {
          first_name,
          last_name,
          account_type,
          email,
          password,
        });
        console.log(response);
        if (response.status === 201) {
          console.log("Signup successful", response.data);
          navigate("/login");
        } else {
          console.error("Signup failed:", response.data.message);
        }
      } catch (error) {
        console.error("Error during Signup:", error);
        newErrors = {
          ...newErrors,
          password: "Email or Password is invalid!",
        };
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="container-fluid vh-100 signup-background">
      {/* Top Center Title */}
      <div
        className="text-center position-absolute top-0 start-50 translate-middle-x mt-3 fontColor"
        style={{ cursor: "default" }}
      >
        <h1>Skill Assessment</h1>
      </div>

      <div className="row h-100">
        {/* Left Side: Motivational Text */}
        <div className="col-md-8 d-none d-md-flex justify-content-center align-items-center">
          <div className="text-left">
            <h1 className="font-weight-bold motivationText fontColor">
              Im<span className="highlight-text">pro</span>vise.
              <br />
              <span className="sub-text">Adapt.</span>
              <br />
              Overcome.
            </h1>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <div className="signup-form">
            <form
              className="roundedBorder d-flex flex-column justify-content-center p-4 fontColor"
              style={{ backgroundColor: "white" }}
            >
              <h3 className="text-center fs-1 fw-bolder">Sign Up</h3>
              <div className="form-group mt-3">
                <label htmlFor="email" className="fs-5">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control fs-5"
                  id="email"
                  name="email"
                  autoComplete="true"
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <div className="mt-1 p-0">
                  <p className="small text-danger m-0 p-0">{errors.email}</p>
                </div>
              )}
              <div className="form-group mt-3">
                <label htmlFor="first_name" className="fs-5">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control fs-5"
                  id="first_name"
                  name="first_name"
                  autoComplete="true"
                  onChange={handleChange}
                />
              </div>
              {errors.first_name && (
                <div className="mt-1 p-0">
                  <p className="small text-danger m-0 p-0">
                    {errors.first_name}
                  </p>
                </div>
              )}
              <div className="form-group mt-3">
                <label htmlFor="last_name" className="fs-5">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control fs-5"
                  id="last_name"
                  name="last_name"
                  autoComplete="true"
                  onChange={handleChange}
                />
              </div>
              {errors.last_name && (
                <div className="mt-1 p-0">
                  <p className="small text-danger m-0 p-0">
                    {errors.last_name}
                  </p>
                </div>
              )}
              <div className="form-group mt-3">
                <label htmlFor="account_type" className="fs-5">
                  User Role
                </label>
                <select
                  className="form-control fs-5"
                  id="account_type"
                  name="account_type"
                  onChange={handleChange}
                  value={credentials.account_type}
                >
                  <option value="" disabled>
                    Select account type
                  </option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {errors.account_type && (
                <div className="mt-1 p-0">
                  <p className="small text-danger m-0 p-0">
                    {errors.account_type}
                  </p>
                </div>
              )}
              <div className="form-group position-relative mt-3">
                <label htmlFor="password" className="fs-5">
                  Password
                </label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="form-control fs-5"
                  id="password"
                  name="password"
                  autoComplete="true"
                  onChange={handleChange}
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "70%",
                    right: "10px",
                    cursor: "pointer",
                    transform: "translateY(-50%)",
                    height: "1em",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                  />
                </span>
              </div>
              {errors.password && (
                <div className="mt-1 p-0">
                  <p className="small text-danger p-0">{errors.password}</p>
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary btnColor fs-5 p-2 mt-3"
                onClick={handleSubmit}
              >
                Sign Up
              </button>
              <div className="d-flex justify-content-center mt-2">
                <p className="m-0 p-0">Already an User?</p>
                <button className="notBtn" onClick={() => navigate("/login")}>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
