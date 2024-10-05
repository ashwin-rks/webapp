import React from "react";
import CourseEnrollment from "./UserHomeComponents/CourseEnrollment";
import SkillAttainment from "./UserHomeComponents/SkillAttainment";
import CourseScores from "./UserHomeComponents/CourseScores";
import SkillCompetency from "./UserHomeComponents/SkillCompetency";

const UserHome = () => {
  return (
    <div className="container-fluid w-100">
      <div className="row">
        <div className="col-12 mb-4">
          <h3 className="p-0 fontColor">Home</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-6">
          <div className="card mb-4">
            <div className="card-body">
              <CourseEnrollment />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card mb-4">
            <div className="card-body">
              <SkillAttainment />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-6">
          <div className="card mb-4">
            <div className="card-body">
              <CourseScores />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card mb-4">
            <div className="card-body">
              <SkillCompetency />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
