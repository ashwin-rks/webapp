import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import AddSkills from "./AddSkills";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";

const SkillTable = () => {
  const [skills, setSkills] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null); // Current skill being edited
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering skills
  const [selectedDepartments, setSelectedDepartments] = useState([]); // Selected departments

  useEffect(() => {
    const getSkillsInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/admin/get-skills",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    const getDepartments = async () => {
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

        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    getSkillsInfo();
    getDepartments();
  }, []);

  const handleEdit = (skill) => {
    setCurrentSkill(skill);
    setSelectedDepartments(
      skill.departmentNames.map((name) => ({ label: name, value: name }))
    );
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const payload = {
      id: currentSkill.id,
      name: currentSkill.name,
      departments: selectedDepartments.map((dept) => dept.value),
    };

    try {
      const response = await axios.patch(
        "http://localhost:8000/admin/edit-skill",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update Response:", response.data);
      const updatedSkills = skills.map((skill) =>
        skill.id === currentSkill.id
          ? {
              ...skill,
              name: currentSkill.name,
              departmentNames: selectedDepartments.map((dept) => dept.value),
            }
          : skill
      );
      setSkills(updatedSkills);
      toast.success("Skill updated Sucssesfuly");
    } catch (error) {
      console.error(
        "Error updating skill:",
        error.response ? error.response.data : error.message
      );
      toast.error("Unable to update to skill");
    }

    setShowModal(false);
  };

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const departmentOptions = departments
    .filter((dept) => !currentSkill?.departmentNames.includes(dept.name))
    .map((dept) => ({ label: dept.name, value: dept.name }));

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
    <div className="container mt-4">
      <div className="row">
        <div className="col-4 p-0">
          <div className="input-group">
            <span
              className="input-group-text"
              style={{ border: "1px solid #5949f4" }}
            >
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              id="skillSearch"
              name="skillSearch"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-3 p-0 ms-3">
          <AddSkills />
        </div>
      </div>

      <div className="row mt-2">
        <table className="table table-bordered table-responsive w-100 tableColor">
          <thead className="text-center tableHeader">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Total People</th>
              <th>Total Departments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center tableBody">
            {filteredSkills.map((skill) => (
              <tr key={skill.id}>
                <td>{skill.id}</td>
                <td>{skill.name}</td>
                <td>{skill.totalPeople}</td>
                <td>{skill.totalDepartments}</td>
                <td>
                  <button
                    className="btn btn-primary btnColor"
                    onClick={() => handleEdit(skill)}
                  >
                    <FaEdit /> Edit
                  </button>
                </td>
              </tr>
            ))}
            {filteredSkills.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No Skills found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Skill Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Skill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentSkill && (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formSkillName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentSkill.name}
                  onChange={(e) =>
                    setCurrentSkill({ ...currentSkill, name: e.target.value })
                  } // Update name
                  required
                />
              </Form.Group>

              {/* Departments Multi-Select */}
              <Form.Group controlId="formDepartments" className="mb-3">
                <Form.Label>Departments</Form.Label>
                <Select
                  isMulti
                  options={departmentOptions}
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

export default SkillTable;
