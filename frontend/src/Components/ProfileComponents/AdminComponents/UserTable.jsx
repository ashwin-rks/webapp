import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaTrashAlt, FaSearch } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import "../../styles.css";
import { toast } from "react-toastify";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:8000/admin/get-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.response ? error.response.data : error.message);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    (user.firstName + " " + user.lastName).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (userId, firstName, lastName) => {
    setCurrentUserId(userId);
    setCurrentUserName(`${firstName} ${lastName}`);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8000/admin/delete-user/${currentUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Update the users array by removing the deleted user
        setUsers(users.filter((user) => user.id !== currentUserId));
        toast.success('User deleted successfully');
      }
    } catch (error) {
      toast.error('Unable to delete user');
      console.error(error);
    }

    setShowDeleteModal(false);
    setCurrentUserId(null);
    setCurrentUserName(null);
  };

  const handleView = (userId) => {
    navigate(`/admin/users/${userId}`); 
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-4 p-0">
          <div className="input-group">
            <span className="input-group-text" style={{ border: "1px solid #5949f4" }}>
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              id="userSearch"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row mt-2">
        <table className="table table-bordered table-responsive w-100 tableColor">
          <thead className="text-center tableHeader">
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department Name</th>
              <th>User Since</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center tableBody">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>{user.deptName}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                <td>
                  {user.accountType === "admin" ? (
                    <span className="text-muted">Admin</span>
                  ) : (
                    <>
                      <button className="btn btnColorSecondary me-2" onClick={() => handleView(user.id)}>
                        <FaEye /> View
                      </button>
                      <button
                        className="btn btn-danger btnColor"
                        onClick={() => handleDelete(user.id, user.firstName, user.lastName)}
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete {currentUserName}'s account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserTable;
