import React, { useState, useEffect, useContext } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function UpdateStudent({ student, onClose, setStudents, students }) {
  const [updatedStudent, setUpdatedStudent] = useState({ ...student }); // Pre-fill with student data
  const api_url = import.meta.env.VITE_URL;
  const alertcontext = useContext(alertContext);
  const loadingcontext = useContext(loadingContext);
  const { showAlert } = alertcontext;
  const { setLoading } = loadingcontext;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent({ ...updatedStudent, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${api_url}/students/updatestudent/${updatedStudent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
        body: JSON.stringify(updatedStudent),
      });
      if (!response.ok) {
        setLoading(false)
        showAlert("Failed to update student",'danger');
      }
      const updatedList = students.map((stu) =>
        stu._id === updatedStudent._id ? updatedStudent : stu
      );
      setStudents(updatedList); // Update the student list
      onClose(); // Close the modal
      setLoading(false)
      showAlert('Student Record is updated successfully','success');
    } catch (error) {
      setLoading(false)
      showAlert(error,'danger');
      console.error("Error updating student:", error);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h4>Update Student</h4>
        <form>
          <label>Name:</label>
          <input type="text" name="name" value={updatedStudent.name} onChange={handleChange} className="form-control mb-2"/>
          <label>Email:</label>
          <input type="email" name="email" value={updatedStudent.email} onChange={handleChange} className="form-control mb-2"/>
          <label>Phone:</label>
          <input type="text" name="phone" value={updatedStudent.phone} onChange={handleChange} className="form-control mb-2"/>
          <label>DOB:</label>
          <input type="date" name="date" value={updatedStudent.dob} onChange={handleChange} className="form-control mb-2"/>
          <label>Address:</label>
          <input type="text" name="address" value={updatedStudent.address} onChange={handleChange} className="form-control mb-2"/>    
          {/* Add other fields as necessary */}
          <button type="button" className="btn btn-primary me-2" onClick={handleUpdate}>Save</button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "5px",
    width: "500px",
    maxWidth: "90%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
};
