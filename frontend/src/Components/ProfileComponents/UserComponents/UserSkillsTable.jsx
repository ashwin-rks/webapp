import React, { useEffect, useState } from "react";
import { Nav, Table, Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { FaSearch, FaBook } from "react-icons/fa";
import Select from "react-select";
import { toast } from "react-toastify";
import "./userCourses.css";

const UserSkillsTable = () => {
  const [activeTab, setActiveTab] = useState("availableSkills");
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [competency, setCompetency] = useState("");
  const [modalType, setModalType] = useState(""); // "add" or "update"

  // Fetch skills data from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/user/get-user-skills",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
        toast.error("Error fetching skills data");
      }
    };
    fetchSkills();
  }, []);

  // Separate available skills and user skills
  const availableSkills = skills
    .filter((skill) => skill.competency === null)
    .filter((skill) =>
      skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const userSkills = skills
    .filter((skill) => skill.competency !== null)
    .filter((skill) =>
      skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Handle open modal for adding/updating competency
  const handleOpenModal = (skillId, type) => {
    setSelectedSkillId(skillId);
    setModalType(type);
    setShowModal(true);
  };

  // Handle submission for adding or updating competency
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const url =
      modalType === "add"
        ? "http://localhost:8000/user/add-user-skill"
        : "http://localhost:8000/user/update-user-competency";

    const payload = {
      skill_id: selectedSkillId,
      competency,
    };

    try {
      if (modalType === "add") {
        await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Skill added successfully");
      } else {
        await axios.patch(url, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Competency updated successfully");
      }

      // Refresh skills after update
      const response = await axios.get(
        "http://localhost:8000/user/get-user-skills",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSkills(response.data);
      setShowModal(false);
      setCompetency("");
    } catch (error) {
      console.error("Error submitting competency:", error);
      toast.error("Error submitting competency");
    }
  };

  // Competency options for the select dropdown
  const competencyOptions = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];

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
      {/* Navigation between Available Skills and User Skills */}
      <Nav
        variant="pills"
        activeKey={activeTab}
        onSelect={(selectedTab) => setActiveTab(selectedTab)}
        className="custom-nav-pills"
      >
        <Nav.Item>
          <Nav.Link
            eventKey="availableSkills"
            className={activeTab === "availableSkills" ? "active-pill" : ""}
          >
            Available Skills
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="userSkills"
            className={activeTab === "userSkills" ? "active-pill" : ""}
          >
            User Skills
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Search bar */}
      <div className="col-4 p-0">
        <div className="input-group mt-4">
          <span
            className="input-group-text"
            style={{ border: "1px solid #5949f4" }}
          >
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search skills"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Available Skills Table */}
      {activeTab === "availableSkills" && (
        <div className="row mt-2">
          <Table className="table table-bordered table-responsive w-100 tableColor">
            <thead className="text-center tableHeader">
              <tr>
                <th>Skill ID</th>
                <th>Skill Name</th>
                <th>Learn</th>
              </tr>
            </thead>
            <tbody className="text-center tableBody">
              {availableSkills.length > 0 ? (
                availableSkills.map((skill) => (
                  <tr key={skill.skill_id}>
                    <td>{skill.skill_id}</td>
                    <td>{skill.skill_name}</td>
                    <td>
                      <button
                        className="btn btn-primary btnColor"
                        onClick={() => handleOpenModal(skill.skill_id, "add")}
                      >
                        <FaBook /> Learn
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No available skills
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* User Skills Table */}
      {activeTab === "userSkills" && (
        <div className="row mt-2">
          <Table className="table table-bordered table-responsive w-100 tableColor">
            <thead className="text-center tableHeader">
              <tr>
                <th>Skill ID</th>
                <th>Skill Name</th>
                <th>Competency</th> {/* New Competency column */}
                <th>Update Competency</th>
              </tr>
            </thead>
            <tbody className="text-center tableBody">
              {userSkills.length > 0 ? (
                userSkills.map((skill) => (
                  <tr key={skill.skill_id}>
                    <td>{skill.skill_id}</td>
                    <td>{skill.skill_name}</td>
                    <td>{skill.competency}</td> {/* Displaying competency */}
                    <td>
                      <button
                        className="btn btn-primary btnColor"
                        onClick={() =>
                          handleOpenModal(skill.skill_id, "update")
                        }
                      >
                        <FaBook /> Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No user skills
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
      {/* Modal for Adding or Updating Competency */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add" ? "Add Competency" : "Update Competency"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select Competency Level</Form.Label>
              <Select
                options={competencyOptions}
                value={competencyOptions.find(
                  (opt) => opt.value === competency
                )}
                onChange={(selected) => setCompetency(selected.value)}
                placeholder="Select Competency"
                styles={customSelectStyles}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary btnColor" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserSkillsTable;
