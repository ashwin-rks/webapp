import React from "react";
import CourseDepartment from "../../HomeComonents/CourseDepartment";
import SkillDepartment from "../../HomeComonents/SkillDepartment";
import UserGrowth from "../../HomeComonents/UserGrowth";
import UserGrowthDept from "../../HomeComonents/UserGrowthDept";

const Home = () => {
  return (
    <div className="container-fluid w-100">
      <div className="row">
        <div className="col-12 mb-4">
          <h3 className="p-0 fontColor">Home</h3>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="card mb-4"> {/* Card wrapper for UserGrowth */}
                <div className="card-body">
                  <UserGrowth />
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="card mb-4"> {/* Card wrapper for UserGrowthDept */}
                <div className="card-body">
                  <UserGrowthDept />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="card mb-4"> {/* Card wrapper for SkillDepartment */}
                <div className="card-body">
                  <SkillDepartment />
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="card mb-4"> {/* Card wrapper for CourseDepartment */}
                <div className="card-body">
                  <CourseDepartment />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
