import React, { useEffect, useState } from "react";
import axios from "axios";
import AddDepartments from "./AddDepartments";
import DepartmentTable from "./DepartmentTable";

const Departments = () => {
  const [existingDepartments, setExistingDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/admin/get-departments",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setExistingDepartments(response.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="conatainer-fluid w-100">
      <div className="row">
        <div className="col-12">
        <h3 className='p-0 fontColor'>Departments</h3>
        </div>
      </div>
      {/* Adds Department */}
      <div className="row">
        <div className="col-12">
          <AddDepartments existingDepartments={existingDepartments} />
        </div>
      </div>

      {/* Departments Table */}
      <div className="row">
        <div className="col-12">
          <DepartmentTable departments={existingDepartments} />
        </div>
      </div>
    </div>
  );
};

export default Departments;
