import React, { useState, useEffect, useContext } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";
import FetchContext from "../context/fetchStudentRecord/fetchContex";

export default function Message() {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredStudents, setFilteredStudents] = useState([]); // State for filtered students
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");
  const api_url = import.meta.env.VITE_URL;
  const { students, fetchStuRecord } = useContext(FetchContext);
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

  // Open modal for specific student
  const openModal = (student) => {
    setSelectedStudent(student);
    setMessage(""); // Reset message
  };

  // Send the message
  const sendMessage = () => {
    if (!message.trim()) {
      showAlert("Message cannot be empty.",'danger');
      return;
    }

    // Make API call to send message
    setLoading(true);
    fetch(`${api_url}/send-message/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ studentId: selectedStudent._id, message: message }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        showAlert(data.msg, 'success');
        setSelectedStudent(null); // Close modal
      })
      .catch((error) => {
        setLoading(false);
        showAlert(error.message, 'danger');
        console.error("Error sending message:", error);
      });
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Send Messages to Students</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search..." aria-label="Search" aria-describedby="search-button" value={searchQuery} onChange={handleSearchChange} />
          </div>
        </div>
      </div>
      {/* Student List */}
      <ul className="list-group">
        {filteredStudents.filter((student) => student.enrolled === true).length > 0 ? (
          filteredStudents.filter((student) => student.enrolled === true).map((student) => (
            <li key={student._id} className="list-group-item d-flex flex-column flex-md-row flex-wrap justify-content-between align-items-start my-2">
              <div className="mb-2 mb-md-0">
                <strong>Name:</strong> {student.name} <br />
                <strong>Email:</strong> {student.email} <br />
                <strong>Phone:</strong> {student.phone} <br />
                <strong>Course:</strong> {student.course} <br />
                <strong>Gender:</strong> {student.gender} <br />
                <strong>DOB:</strong> {student.dob} <br />
                <strong>Address:</strong> {student.address}
              </div>
              <div className="mt-2 mt-md-0">
                <button className="btn btn-primary btn-sm" onClick={() => openModal(student)}>Send Message</button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center my-3">No records to show</p>
        )}
      </ul>

      {/* Modal */}
      {
        selectedStudent && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Send Message to {selectedStudent.name}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedStudent(null)} ></button>
                </div>
                <div className="modal-body">
                  <textarea className="form-control" rows="4" placeholder="Enter your message..." value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedStudent(null)} >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}
