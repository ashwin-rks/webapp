import React from 'react';
import { useParams } from 'react-router-dom';
import SkillCompetency from '../UserComponents/UserHomeComponents/SkillCompetency';
import CourseScores from '../UserComponents/UserHomeComponents/CourseScores';
import SkillAttainment from '../UserComponents/UserHomeComponents/SkillAttainment';
import CourseEnrollment from '../UserComponents/UserHomeComponents/CourseEnrollment';

const UserDetails = () => {
  const { userId } = useParams(); 
  return (
    <div className="container-fluid w-100">
      <div className="row">
        <div className="col-12 mb-4">
          <h3 className="p-0 fontColor">User Details</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-6">
          <div className="card mb-4">
            <div className="card-body">
              <CourseEnrollment userId={userId}/>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card mb-4">
            <div className="card-body">
              <SkillAttainment userId={userId}/>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-6">
          <div className="card mb-4">
            <div className="card-body">
              <CourseScores userId={userId}/>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card mb-4">
            <div className="card-body">
              <SkillCompetency userId={userId}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
