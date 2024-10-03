import React, { useState, useEffect } from "react";
import axios from "axios";
import { Nav, Card, Row, Col, Modal, Button, Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import './userCourses.css';

const UserCoursesGrid = () => {
  const [activeTab, setActiveTab] = useState("notEnrolled");
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [score, setScore] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/user/get-courses",
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

    fetchCourses();
  }, []);

  const notEnrolledCourses = courses
    .filter((course) => course.user_score === null)
    .filter((course) => course.course_name.toLowerCase().includes(searchTerm.toLowerCase()));

  const enrolledCourses = courses
    .filter((course) => course.user_score !== null)
    .filter((course) => course.course_name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleEnrollClick = (courseId) => {
    setSelectedCourseId(courseId);
    setShowModal(true);
  };

  const handleEnrollSubmit = async () => {
    if (score < 0 || score > 100 || isNaN(score)) {
      toast.error("Enter a valid score");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:8000/user/enroll-course",
        {
          course_id: selectedCourseId,
          user_score: parseInt(score),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShowModal(false);
      setScore("");
      toast.success("Course Enrolled successfully");

      // Refresh the courses list
      const response = await axios.get("http://localhost:8000/user/get-courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(response.data);
    } catch (error) {
      toast.error("Error enrolling in course");
      console.error("Error enrolling in course:", error);
    }
  };

  return (
    <div className="container my-4">

      {/* Navigation between Not Enrolled and Enrolled tabs */}
      <Nav
        variant="pills"
        activeKey={activeTab}
        onSelect={(selectedTab) => setActiveTab(selectedTab)}
        className="custom-nav-pills"
      >
        <Nav.Item>
          <Nav.Link
            eventKey="notEnrolled"
            className={activeTab === "notEnrolled" ? "active-pill" : ""}
          >
            Not Enrolled Courses
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="enrolled"
            className={activeTab === "enrolled" ? "active-pill" : ""}
          >
            Enrolled Courses
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {/* Search bar */}
      <div className="col-4 p-0">
        <div className="input-group mt-4">
          <span className="input-group-text" style={{ border: "1px solid #5949f4" }}>
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            id="departmentSearch"
            name="departmentSearch"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Display filtered courses based on the active tab */}
      <div className="mt-4">
        {activeTab === "notEnrolled" && (
          <Row>
            {notEnrolledCourses.length > 0 ? (
              notEnrolledCourses.map((course) => (
                <Col
                  md={4}
                  sm={6}
                  xs={12}
                  key={course.course_id}
                  className="mb-4"
                >
                  <Card className="h-100">
                    <Card.Img
                      variant="top"
                      src={course.course_img}
                      alt={course.course_name}
                    />
                    <Card.Body className="fontColor">
                      <Card.Title>{course.course_name}</Card.Title>
                      <Card.Text>{course.course_desc}</Card.Text>
                      <Card.Text>
                        <strong>Created by:</strong> {course.course_creator}
                      </Card.Text>
                      <button
                        className="btn btn-primary btnColor"
                        onClick={() => handleEnrollClick(course.course_id)}
                      >
                        Enroll
                      </button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <div className="text-center">
                  No courses available for enrollment
                </div>
              </Col>
            )}
          </Row>
        )}

        {activeTab === "enrolled" && (
          <Row>
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <Col
                  md={4}
                  sm={6}
                  xs={12}
                  key={course.course_id}
                  className="mb-4"
                >
                  <Card className="h-100">
                    <Card.Img
                      variant="top"
                      src={course.course_img}
                      alt={course.course_name}
                    />
                    <Card.Body className="fontColor">
                      <Card.Title>{course.course_name}</Card.Title>
                      <Card.Text>{course.course_desc}</Card.Text>
                      <Card.Text>
                        <strong>Created by:</strong> {course.course_creator}
                      </Card.Text>
                      <Card.Text>
                        <strong>Score:</strong> {course.user_score}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <div className="text-center">No enrolled courses</div>
              </Col>
            )}
          </Row>
        )}
      </div>

      {/* Modal for Enrolling */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enroll in Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Enter Score (0 - 100)</Form.Label>
              <Form.Control
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Enter your score"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary btnColor" onClick={handleEnrollSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserCoursesGrid;
