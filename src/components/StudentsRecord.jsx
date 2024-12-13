import React, { useState, useEffect, useContext } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function StudentsRecord() {
  const [students, setStudents] = useState([]);
  const api_url = import.meta.env.VITE_URL;
  const alertcontext = useContext(alertContext);
  const loadingcontext = useContext(loadingContext);
  const { showAlert } = alertcontext;
  const { setLoading } = loadingcontext;

  // Fetch student data (API call)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api_url}/students/fetchstudents`, {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem('token')
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const json = await response.json();
        setLoading(false);
        setStudents(json);
      } catch (err) {
        setLoading(false);
        showAlert(err.message, 'danger');
      }
    }

    fetchData();
  }, []);

  const updateStudent = () => {
    showAlert('Coding has not been completed for student record Deletion', 'info')
  };

  const deleteStudent = async () => {
    showAlert('Coding has not been completed for student record Deletion', 'info')
    // fetch(`/api/students/${id}`, { method: "DELETE" })
    //   .then(() => setStudents(students.filter((student) => student.id !== id)))
    //   .catch((error) => console.error("Error deleting student:", error));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Students Record</h2>
      <ul className="list-group mb-3">
        {students.map((student) => (
          <li
            key={student._id}
            className="list-group-item d-flex flex-column flex-md-row flex-wrap justify-content-between align-items-start my-2"
          >
            <div className="mb-2 mb-md-0">
              <strong>Name:</strong> {student.name} <br />
              <strong>Email:</strong> {student.email} <br />
              <strong>Phone:</strong> {student.phone} <br />
              <strong>DOB:</strong> {student.dob} <br />
              <strong>Gender:</strong> {student.gender} <br />
              <strong>Course:</strong> {student.course} <br />
              <strong>Address:</strong> {student.address}
            </div>
            <div className="mt-2 mt-md-0">
              <button className="btn btn-success btn-sm me-2" onClick={() => updateStudent(student._id)}>Update</button>
              <button className="btn btn-danger btn-sm" onClick={() => deleteStudent(student._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
