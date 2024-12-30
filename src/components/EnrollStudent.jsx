import React, { useState, useContext, useEffect } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";
import FetchContext from "../context/fetchStudentRecord/fetchContex";

export default function AddStudent() {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredStudents, setFilteredStudents] = useState([]); // State for filtered students
  const api_url = import.meta.env.VITE_URL;
  const { students, setStudents, fetchStuRecord } = useContext(FetchContext);
  const alertcontext = useContext(alertContext);
  const loadingcontext = useContext(loadingContext);
  const { showAlert } = alertcontext;
  const { setLoading } = loadingcontext;

  // Fetch student data (API call)
  useEffect(() => {
    fetchStuRecord();
  }, []);

  useEffect(() => {
    setFilteredStudents(students); // Initially, all students are displayed
  }, [students]);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Handle search query changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debounceFilterStudents(value);
  };

  // Filter students based on the search query
  const filterStudents = (query) => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  // Debounced version of filterStudents
  const debounceFilterStudents = debounce(filterStudents, 300);

  const enrollStudent = async (student) => {
    setLoading(true);
    const updatedStudent = { ...student, enrolled: true };
    await fetch(`${api_url}/students/updatestudent/${student._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify(updatedStudent),
    })
      .then((response) => response.json())
      .then((student) => {
        setLoading(false);
        showAlert(student.msg, 'success');
        fetchStuRecord(); // Refresh the student list
      })
      .catch((error) => {
        setLoading(false);
        showAlert(error.message, 'danger');
        console.log("Error enrolling student:", error);
      });
  };

  const deleteStudent = async (id) => {
    setLoading(true);
    try {
      await fetch(`${api_url}/students/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
      });
      setStudents(students.filter((student) => student._id !== id));
      setFilteredStudents(filteredStudents.filter((student) => student._id !== id));
      setLoading(false);
      showAlert("Student Record is deleted successfully", "success");
    } catch (error) {
      setLoading(false);
      showAlert("Error deleting student", "danger");
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">New Registered Students for Enquiry </h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search..." aria-label="Search" aria-describedby="search-button" value={searchQuery} onChange={handleSearchChange} />
          </div>
        </div>
      </div>
      <ul className="list-group mb-3">
        {filteredStudents.filter(student => student.enrolled === false).length > 0 ? (
          filteredStudents.filter(student => student.enrolled === false) // Filter for non-enrolled students
            .map((student) => (
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
                  <button className="btn btn-success btn-sm me-2" onClick={() => enrollStudent(student)}>Add Student</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteStudent(student._id)}>Remove Student</button>
                </div>
              </li>
            ))
        ) : (
          <p className="text-center my-3">No records to show</p>
        )}
      </ul>
    </div>
  );
}
