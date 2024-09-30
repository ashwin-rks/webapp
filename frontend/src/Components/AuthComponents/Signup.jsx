import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
import "./authStyles.css";

const Signup = () => {
  return (
    <div className="container-fluid vh-100 signup-background"> 
      {/* Top Center Title */}
      <div className="text-center position-absolute top-0 start-50 translate-middle-x mt-3">
        <h1>Skill Assessment</h1>
      </div>

      <div className="row h-100">
        {/* Left Side: Motivational Text */}
        <div className="col-md-8 d-none d-md-flex justify-content-center align-items-center">
          <div className="text-left">
            <h1 className="font-weight-bold motivationText">
              Improvise.
              <br />
              Adapt.
              <br />
              Overcome.
            </h1>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <div className="signup-form">
            <form className="roundedBorder d-flex flex-column justify-content-center gap-3 p-4">
              <h3 className="text-center fs-1 fw-bolder">Sign Up</h3>
              <div className="form-group">
                <label htmlFor="email" className="fs-5">Email</label>
                <input type="email" className="form-control fs-5" id="email" name="email" autoComplete="true" />
              </div>
              <div className="form-group">
                <label htmlFor="first_name" className="fs-5">First Name</label>
                <input type="text" className="form-control fs-5" id="first_name" name="first_name" autoComplete="false" />
              </div>
              <div className="form-group">
                <label htmlFor="last_name" className="fs-5">Last Name</label>
                <input type="text" className="form-control fs-5" id="last_name" name="last_name" autoComplete="false" />
              </div>
              <div className="form-group">
                <label htmlFor="account_type" className="fs-5">User Role</label>
                <select className="form-control fs-5" id="account_type" name="account_type">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="password" className="fs-5">Password</label>
                <input type="password" className="form-control fs-5" id="password" name="password" autoComplete="true" />
              </div>
              <button type="submit" className="btn btn-primary btn-block fs-5 p-2">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
