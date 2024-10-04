import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; 

const EditUser = ({ userInfo }) => {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState(userInfo.name);
  const [lastName, setLastName] = useState(userInfo.last_name);
  const [isFirstNameInvalid, setIsFirstNameInvalid] = useState(false);
  const [isLastNameInvalid, setIsLastNameInvalid] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setFirstName(userInfo.name);
    setLastName(userInfo.last_name);
    setShow(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token); 
      setIsAdmin(decodedToken.account_type === 'admin'); 
    }
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate names
    if (!firstName.trim()) {
      setIsFirstNameInvalid(true);
      isValid = false;
    } else {
      setIsFirstNameInvalid(false);
    }

    if (!lastName.trim()) {
      setIsLastNameInvalid(true);
      isValid = false;
    } else {
      setIsLastNameInvalid(false);
    }

    if (!isValid) return; // Exit if validation fails

    try {
      const token = localStorage.getItem("token");
      const endpoint = isAdmin 
        ? "http://localhost:8000/admin/edit-user-info" 
        : "http://localhost:8000/user/edit-user-info"; 

      const response = await axios.patch(
        endpoint,
        { first_name: firstName, last_name: lastName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      toast.success("User info updated successfully");
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error("Error updating user info");
    }

    setShow(false);
  };

  return (
    <>
      <button className="btn btn-primary btnColor" onClick={handleShow}>
        Edit User
      </button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* First Name Input */}
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setIsFirstNameInvalid(false);
                }}
                isInvalid={isFirstNameInvalid}
              />
            </Form.Group>

            {/* Last Name Input */}
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setIsLastNameInvalid(false);
                }}
                isInvalid={isLastNameInvalid}
              />
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="btnColor">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditUser;
