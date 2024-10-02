import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

const AddSkills = () => {
  const [show, setShow] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isSkillNameInvalid, setIsSkillNameInvalid] = useState(false);
  const [isDepartmentsInvalid, setIsDepartmentsInvalid] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get("http://localhost:8000/admin/get-departments", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        const departments = response.data
        .filter((dept) => dept.name.toLowerCase() !== "manager") 
        .map((dept) => ({
          value: dept.id,
          label: dept.name,
        }));

        setDepartmentOptions(departments); 
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDepartmentChange = (selectedOptions) => {
    setSelectedDepartments(selectedOptions);
    setIsDepartmentsInvalid(false); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate skill name
    if (!skillName.trim()) {
      setIsSkillNameInvalid(true);
      isValid = false;
    } else {
      setIsSkillNameInvalid(false);
    }

    // Validate departments
    if (selectedDepartments.length === 0) {
      setIsDepartmentsInvalid(true);
      isValid = false;
    } else {
      setIsDepartmentsInvalid(false);
    }

    if (!isValid) return; 

    // If validation passes
    const departmentNames = selectedDepartments.map((dept) => dept.label); // Extract department names

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
  
      // Send a POST request to the backend
      const response = await axios.post("http://localhost:8000/admin/add-skill", {
        skillName,
        departmentNames,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Set the token in the Authorization header
        },
      });
      console.log(response.data);
      toast.success('Added Skill')
  
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error('Error adding skill')
    }

    // Reset the form
    setSkillName(""); 
    setSelectedDepartments([]); 
    setShow(false);
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "4px",
      border: isDepartmentsInvalid ? "1px solid rgb(200, 0, 0)" : "1px solid #5949f4",
      boxShadow: state.isFocused
        ? isDepartmentsInvalid
          ? "0 0 8px rgba(200, 0, 0, 0.5)"
          : "0 0 8px rgba(0, 123, 255, 0.5)"
        : isDepartmentsInvalid
        ? "0 0 8px rgba(200, 0, 0, 0.5)"
        : "none",
      "&:hover": {
        borderColor: isDepartmentsInvalid ? "rgb(200, 0, 0)" : "#5949f4",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "#fff" : "#333",
      backgroundColor: state.isFocused ? "#5949f4" : "white",
    }),
  };

  return (
    <>
      <button className="btn btn-primary btnColor" onClick={handleShow}>
        Add Skills
      </button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Skill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Skill Name Input */}
            <Form.Group className="mb-3" controlId="formSkillName">
              <Form.Label>Skill Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter skill name"
                value={skillName}
                onChange={(e) => {
                  setSkillName(e.target.value);
                  setIsSkillNameInvalid(false); // Reset validation on input change
                }}
                style={{
                  boxShadow: isSkillNameInvalid
                    ? "0 0 8px rgba(200, 0, 0, 0.5)"
                    : "none",
                  borderColor: isSkillNameInvalid
                    ? "rgb(200, 0, 0)"
                    : "#5949f4",
                }}
              />
            </Form.Group>

            {/* Department Dropdown */}
            <Form.Group className="mb-3" controlId="formDepartments">
              <Form.Label>Select Departments</Form.Label>
              <Select
                isMulti
                options={departmentOptions}
                value={selectedDepartments}
                onChange={handleDepartmentChange}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Choose departments"
                styles={customSelectStyles}
              />
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="btnColor">
              Save Skill
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddSkills;
