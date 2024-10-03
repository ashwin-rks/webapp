import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const ResetPassword = () => {
  const [show, setShow] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOldPasswordInvalid, setIsOldPasswordInvalid] = useState(false);
  const [isNewPasswordInvalid, setIsNewPasswordInvalid] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setOldPassword("");
    setNewPassword("");
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

    // Validate passwords
    if (!oldPassword.trim()) {
      setIsOldPasswordInvalid(true);
      isValid = false;
    } else {
      setIsOldPasswordInvalid(false);
    }

    if (!newPassword.trim()) {
      setIsNewPasswordInvalid(true);
      isValid = false;
    } else {
      setIsNewPasswordInvalid(false);
    }

    if (!isValid) return; // Exit if validation fails

    try {
      const token = localStorage.getItem("token");
      const endpoint = isAdmin 
        ? "http://localhost:8000/admin/change-password" 
        : "http://localhost:8000/user/change-password"; 
      
      const response = await axios.patch(
        endpoint,
        { old_password: oldPassword, new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Error changing password");
    }

    setShow(false);
  };

  return (
    <>
      <button className="btn btn-danger btnColor" onClick={handleShow}>
        Reset Password
      </button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Old Password Input */}
            <Form.Group className="mb-3" controlId="formOldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  setIsOldPasswordInvalid(false);
                }}
                isInvalid={isOldPasswordInvalid}
              />
            </Form.Group>

            {/* New Password Input */}
            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setIsNewPasswordInvalid(false);
                }}
                isInvalid={isNewPasswordInvalid}
              />
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="btnColor">
              Change Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ResetPassword;
