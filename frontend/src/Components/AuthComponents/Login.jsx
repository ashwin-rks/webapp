import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../styles.css";
import "./authStyles.css";


const Login = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
              Improvise.
              <br />
              <span style={{ color: "#06bee1" }}>Adapt.</span>
              <br />
              Overcome.
            </h1>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <div className="login-form">
            <form
              className="roundedBorder d-flex flex-column justify-content-center gap-3 p-4 fontColor"
              style={{ backgroundColor: "white" }}
            >
              <h3 className="text-center fs-1 fw-bolder">Login</h3>
              <div className="form-group">
                <label htmlFor="email" className="fs-5">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control fs-5"
                  id="email"
                  name="email"
                  autoComplete="true"
                />
              </div>
              <div className="form-group position-relative">
                <label htmlFor="password" className="fs-5">
                  Password
                </label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="form-control fs-5"
                  id="password"
                  name="password"
                  autoComplete="true"
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
              <button
                type="submit"
                className="btn btn-primary btnColor fs-5 p-2"
              >
                Login
              </button>
              <div className="d-flex justify-content-center">
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
}

export default Login