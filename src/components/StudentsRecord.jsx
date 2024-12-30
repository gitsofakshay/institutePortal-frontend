import React, { useState, useEffect, useContext } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";
import FetchContext from "../context/fetchStudentRecord/fetchContex";
import UpdateStudent from "./UpdateStudent"; // Import UpdateStudent component

export default function StudentsRecord() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // State to hold the selected student
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
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

  const handleUpdateClick = (student) => {
    setSelectedStudent(student); // Set the selected student data
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedStudent(null); // Clear the selected student data
  };

  const deleteStudent = async (id) => {
    setLoading(true);
    try {
      await fetch(`${api_url}/students/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      setStudents(students.filter((student) => student._id !== id));
      setFilteredStudents(filteredStudents.filter((student) => student._id !== id));
      showAlert("Student Record is deleted successfully", "success");
    } catch (error) {
      showAlert("Error deleting student", "danger");
      console.error("Error deleting student:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Students Record</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search..." aria-label="Search" aria-describedby="search-button" value={searchQuery} onChange={handleSearchChange} />
          </div>
        </div>
      </div>
      <ul className="list-group mb-3">
        {filteredStudents.filter((student) => student.enrolled === true).length > 0 ? (
          filteredStudents.filter((student) => student.enrolled === true).map((student) => (
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
                <button className="btn btn-success btn-sm me-2" onClick={() => handleUpdateClick(student)}>
                  Update
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteStudent(student._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center my-3">No records to show</p>
        )}
      </ul>

      {/* Update Modal */}
      {isModalOpen && (
        <UpdateStudent student={selectedStudent} onClose={handleCloseModal} setStudents={setStudents} students={students} />)}
    </div>
  );
}
