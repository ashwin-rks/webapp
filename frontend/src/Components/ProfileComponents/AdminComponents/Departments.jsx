import React, { useEffect, useState } from "react";
import axios from "axios";
import AddDepartments from "./AddDepartments";

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
          const departmentNames = response.data.map(
            (department) => department.name
          );
          setExistingDepartments(departmentNames);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="conatainer-fluid w-100">
      {/* Adds Department */}
      <div className="row">
        <div className="col-12">
          <AddDepartments existingDepartments={existingDepartments} />
        </div>
      </div>
    </div>
  );
};

export default Departments;
