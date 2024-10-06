import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaEye, FaSearch } from "react-icons/fa"; 
import { Modal, Button, Form } from "react-bootstrap"; 
import "../../styles.css"; 

const DepartmentTable = ({ departments }) => {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [showModal, setShowModal] = useState(false); 
  const [currentDepartment, setCurrentDepartment] = useState(null); 

  const navigate = useNavigate();

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (department) => {
    setCurrentDepartment(department);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token'); 
  
    const payload = { 
      dept_id: currentDepartment.id, 
      dept_name: currentDepartment.name,
    };
  
    try {
      const response = await axios.patch('http://localhost:8000/admin/update-department', payload, {
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json', 
        },
      });
  
      console.log('Update Response:', response.data); 
      toast.success('Updated department');
    } catch (error) {
      console.error('Error updating department:', error.response ? error.response.data : error.message);
      toast.error('Unable to update department');
    }

    setShowModal(false); 
  };
  
  const handleView = (deptId) => {
    navigate(`/admin/department/${deptId}`); 
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-4 p-0">
          <div className="input-group">
            <span className="input-group-text" style={{border: "1px solid #5949f4"}}>
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
      </div>

      <div className="row mt-2">
        <table className="table table-bordered table-responsive w-100 tableColor">
          <thead className="text-center tableHeader">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Total People</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center tableBody">
            {filteredDepartments.map((department) => (
              <tr key={department.id}>
                <td>{department.id}</td>
                <td>{department.name}</td>
                <td>{department.totalPeople}</td>
                <td>
                  <button className="btn btnColorSecondary me-2" onClick={() => handleView(department.id)}>
                    <FaEye /> View
                  </button>
                  <button className="btn btn-primary btnColor" onClick={() => handleEdit(department)}>
                    <FaEdit /> Edit
                  </button>
                </td>
              </tr>
            ))}
            {filteredDepartments.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  No departments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Department Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentDepartment && (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formDepartmentName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentDepartment.name}
                  onChange={(e) => setCurrentDepartment({ ...currentDepartment, name: e.target.value })} // Update name
                  required
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

export default DepartmentTable;
