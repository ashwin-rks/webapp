import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'
import { FaUser, FaCalendarAlt, FaBuilding } from 'react-icons/fa';
import { toast } from 'react-toastify';
import EditUser from './EditUser'; 
import ResetPassword from './ResetPassword'; 

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);      
  const [isAdmin, setIsAdmin] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUserData = async () => {
      try {
        const decodedToken = jwtDecode(token); 
        setIsAdmin(decodedToken.account_type === 'admin'); 

        const endpoint = isAdmin 
          ? 'http://localhost:8000/admin/get-user-info' 
          : 'http://localhost:8000/user/get-user-info';

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
        setLoading(false);  
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data.');
        setLoading(false);
        toast.error('Error fetching user details');
      }
    };

    fetchUserData();
  }, [isAdmin]);

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  return (
    <div className="container-fluid w-100 mt-4">
      <div className="row">
        <div className="col-12">
          <h3 className="p-0 fontColor mb-4">Profile</h3>
        </div>
        <div className="col-11 mx-auto">
          <div className="card shadow-sm p-4 fontColor">
            <div className="row mb-3">
              <div className="col-md-2 d-flex justify-content-center align-items-center">
                <FaUser size={50} />
              </div>
              <div className="col-md-10">
                <h4 className="mb-1">{userInfo.name} {userInfo.last_name}</h4>
                <p className="mb-0">Email: {userInfo.email}</p>
              </div>
            </div>

            <hr />

            <div className="row">
              <div className="col-md-6 mb-3">
                <FaCalendarAlt className="me-2" />
                <span><strong>User Since:</strong> {formatDate(userInfo.createdAt)}</span>
              </div>
              <div className="col-md-6">
                <FaBuilding className="me-2" />
                <span><strong>Department:</strong> {userInfo.dept_name}</span>
              </div>
            </div>

            <div className="mt-3 d-flex gap-2">
              <EditUser userInfo={userInfo} /> 
              <ResetPassword /> 
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
