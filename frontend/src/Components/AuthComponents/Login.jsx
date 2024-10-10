import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../styles.css";
import "./authStyles.css";

const Login = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // set visibility for password
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // stores changes in field to state
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // Checks for errors in Email field
    if (!credentials.email.trim()) {
      newErrors = {
        ...newErrors,
        email: "Email is required!",
      };
    } 

    // Checks for errors in Password field
    if (!credentials.password.trim()) {
      newErrors = {
        ...newErrors,
        password: "Password is required!",
      };
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const email = credentials.email;
      const password = credentials.password;
      try {
        const response = await axios.post("http://localhost:8000/auth/login", {
          email,
          password,
        });
        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          toast.success("Logged in");
          if (response.data.user && response.data.user.account_type === 'admin') {
            navigate("/admin"); 
          } else {
            navigate("/user"); 
          }
        } else {
          console.error("Login failed:", response.data.error);
        }
      } catch (error) {
        console.error("Error during login:", error);
        newErrors = {
          ...newErrors,
          password: "Email or Password is invalid!",
        };
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="container-fluid vh-100 login-background">
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

        {/* Right Side: Login Form */}
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <div className="login-form">
            <form
              className="roundedBorder d-flex flex-column justify-content-center p-4 fontColor"
              style={{ backgroundColor: "white" }}
            >
              <h3 className="text-center fs-1 fw-bolder">Login</h3>
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
                Login
              </button>
              <div className="d-flex justify-content-center mt-2">
                <p className="m-0 p-0">Not an user?</p>
                <button className="notBtn" onClick={() => navigate("/signup")}>
                  Signup
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
