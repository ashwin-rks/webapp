import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

const AddCourse = () => {
  const [show, setShow] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseImg, setCourseImg] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/admin/get-departments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate course name
    if (!courseName.trim() || courseName.length >= 50) {
      isValid = false;
    }

    // Validate course description
    if (!courseDesc.trim() || courseDesc.length >= 100) {
      isValid = false;
    }

    // Validate departments
    if (selectedDepartments.length === 0) {
      isValid = false;
    }

    if (!isValid) {
      toast.error("Check all fields");
      return;
    }

    // If validation passes
    const departmentNames = selectedDepartments.map((dept) => dept.label);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8000/admin/add-course",
        {
          course_name: courseName,
          course_desc: courseDesc,
          course_img: courseImg,
          departments: departmentNames,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      toast.success("Course added successfully!");
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Adding course failed.");
    }

    // Reset the form
    setCourseName("");
    setCourseDesc("");
    setCourseImg("");
    setSelectedDepartments([]);
    setShow(false);
  };
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "4px",
      border: "1px solid #5949f4",
      boxShadow: state.isFocused ? "0 0 8px rgba(0, 123, 255, 0.5)" : "none",
      "&:hover": {
        borderColor: "#5949f4",
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
        Add Course
      </button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Course Name Input */}
            <Form.Group className="mb-3" controlId="formCourseName">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter course name (<50 characters)"
                value={courseName}
                onChange={(e) => {
                  setCourseName(e.target.value);
                }}
              />
            </Form.Group>

            {/* Course Description Input */}
            <Form.Group className="mb-3" controlId="formCourseDesc">
              <Form.Label>Course Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter course description (<100 characters)"
                value={courseDesc}
                onChange={(e) => {
                  setCourseDesc(e.target.value);
                }}
              />
            </Form.Group>

            {/* Course Image Input */}
            <Form.Group className="mb-3" controlId="formCourseImg">
              <Form.Label>Course Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter course image URL"
                value={courseImg}
                onChange={(e) => setCourseImg(e.target.value)}
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
                placeholder="Choose departments (atleast one)"
                styles={customSelectStyles}
              />
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="btnColor">
              Add Course
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddCourse;
