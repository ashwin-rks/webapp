import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Row,
  Col,
  InputGroup,
  Modal,
  Form,
} from "react-bootstrap";
import { FaEdit, FaSearch } from "react-icons/fa";
import Select from "react-select";
import AddCourse from "./AddCourse";
import "../../styles.css";

const CourseGrid = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null); // Current course being edited
  const [selectedDepartments, setSelectedDepartments] = useState([]); // Selected departments for the course

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/admin/get-courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

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
        // Filter out the "Manager" department
        const filteredDepartments = response.data.filter(
          (dept) => dept.name !== "Manager"
        );
        setDepartments(filteredDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchCourses();
    fetchDepartments();
  }, []);

  // Filter courses based on search term
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setSelectedDepartments(
      course.departmentNames.map((name) => ({ label: name, value: name }))
    );
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!currentCourse.name.trim() || currentCourse.name.length > 50) {
      isValid = false;
    }

    if (
      !currentCourse.description.trim() ||
      currentCourse.description.length > 100
    ) {
      isValid = false;
    }

    if (!currentCourse.course_img.trim()) {
      isValid = false;
    }

    if (!isValid) {
      toast.error("Check all fields");
      return;
    }

    const token = localStorage.getItem("token");

    const payload = {
      course_id: currentCourse.id,
      course_name: currentCourse.name,
      course_desc: currentCourse.description,
      course_img: currentCourse.course_img,
      departments: selectedDepartments.map((dept) => dept.value),
    };

    try {
      await axios.patch("http://localhost:8000/admin/edit-course", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const updatedCourses = courses.map((course) =>
        course.id === currentCourse.id
          ? {
              ...course,
              name: currentCourse.name,
              description: currentCourse.description,
              course_img: currentCourse.course_img,
              departmentNames: selectedDepartments.map((dept) => dept.value),
            }
          : course
      );

      setCourses(updatedCourses);
      setShowModal(false);
      setCurrentCourse(null);
      toast.success("Course updated successfully!");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Error updating course. Please try again.");
    }
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
    <div className="container my-4">
      <Row>
        <div className="col-4 p-0 mb-3">
          <InputGroup>
            <InputGroup.Text style={{ border: "1px solid #5949f4" }}>
              <FaSearch />
            </InputGroup.Text>
            <input
              type="text"
              className="form-control"
              placeholder="Search for courses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
        <div className="col-3 p-0 ms-3 mb-3">
          <AddCourse />
        </div>
      </Row>

      <Row>
        {filteredCourses.map((course) => (
          <Col md={4} sm={6} xs={12} key={course.id} className="mb-4">
            <Card className="h-100">
              <Card.Img variant="top" src={course.course_img} />
              <Card.Body style={{ color: "#5949f4" }}>
                <Card.Title>{course.name}</Card.Title>
                <Card.Text>
                  <strong>Description:</strong> {course.description}
                </Card.Text>
                <Card.Text>
                  <strong>Created By:</strong> {course.creator}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button
                    className="btn btn-primary btnColor"
                    onClick={() => handleEdit(course)}
                  >
                    <FaEdit /> Edit
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {filteredCourses.length === 0 && (
          <Col xs={12}>
            <div className="text-center">No Courses found</div>
          </Col>
        )}
      </Row>

      {/* Edit Course Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentCourse && (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formCourseName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentCourse.name}
                  onChange={(e) =>
                    setCurrentCourse({ ...currentCourse, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formCourseDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={currentCourse.description}
                  onChange={(e) =>
                    setCurrentCourse({
                      ...currentCourse,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formCourseImage" className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={currentCourse.course_img}
                  onChange={(e) =>
                    setCurrentCourse({
                      ...currentCourse,
                      course_img: e.target.value,
                    })
                  }
                />
              </Form.Group>
              {/* Departments Multi-Select */}
              <Form.Group controlId="formDepartments" className="mb-3">
                <Form.Label>Departments</Form.Label>
                <Select
                  isMulti
                  options={departments
                    .filter(
                      (dept) =>
                        !currentCourse.departmentNames.includes(dept.name)
                    )
                    .map((dept) => ({ label: dept.name, value: dept.name }))}
                  value={selectedDepartments}
                  onChange={setSelectedDepartments}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  styles={customSelectStyles}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="btnColor">
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CourseGrid;
