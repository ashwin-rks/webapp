import React, { useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";
import '../../styles.css'


const AddDepartments = ({ existingDepartments }) => {
  const [departmentName, setDepartmentName] = useState("")
  const [error, setError] = useState(false);

  const existingDepartmentNames = existingDepartments.map(
    (department) => department.name
  );

  const handleChange = (e) => {
    setDepartmentName(e.target.value)
    setError(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!departmentName.trim()) {
      setError(true);
      return;
    }

    if (existingDepartmentNames.some(dep => dep.toLowerCase() === departmentName.toLowerCase())) {
      toast.error('Department Already Exists')
      setError(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/admin/add-department', 
        {dept_name: departmentName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        );
        if (response.status === 201) {
          toast.success("Department added successfully");
        }
    } catch (error) {
      console.error(error);
      setError(true);
      toast.error("Error adding department");
    }
    
    setDepartmentName("");
  }
  

  return (
    <form className="d-flex">
      <div className="flex-grow-1 me-2">
        <input
          type="text"
          className={`form-control ${error ? 'form-control-error' : ''}`}
          id="departmentInput"
          name="departmentInput"
          placeholder="Enter department name"
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btnColor d-flex align-items-center justify-content-center"
        style={{ width: "max-content" }}
        onClick={handleSubmit}
      >
        <span className="me-2 p-0">
          <FaPlus />
        </span>
        <p className="d-md-block d-none m-0 p-0">Add Department</p>
      </button>
    </form>
  );
};

export default AddDepartments;
