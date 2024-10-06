import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import "../styles.css";

const TableV = ({ tableData = [] }) => {
  const formatHeader = (header) => {
    return header
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const navigate = useNavigate();

  const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  const handleViewClick = (userId) => {
    console.log(userId);

    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="container mt-4">
      <div className="row mt-2">
        <table className="table table-bordered table-responsive w-100 tableColor">
          <thead className="text-center tableHeader">
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{formatHeader(header)}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center tableBody">
            {tableData.length > 0 ? (
              tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header, colIndex) => (
                    <td key={colIndex}>{row[header]}</td>
                  ))}
                  <td>
                    <button
                      className="btn btnColorSecondary"
                      onClick={() => handleViewClick(row.Id)}
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + 1} className="text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableV;
