import React, { useState, useEffect, useContext } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function Message() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");
  const api_url = import.meta.env.VITE_URL;
  const alertcontext = useContext(alertContext);
  const loadingcontext = useContext(loadingContext);
  const { showAlert } = alertcontext;
  const { setLoading } = loadingcontext;

  // Fetch student data (mocked API call)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api_url}/students/fetchstudents`, {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem('token'),
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

  // Open modal for specific student
  const openModal = (student) => {
    setSelectedStudent(student);
    setMessage(""); // Reset message
  };

  // Send the message
  const sendMessage = () => {
    if (!message.trim()) {
      alert("Message cannot be empty.");
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
      });
  };

  return (
    <div>
      <h2 className="text-center mb-4">Send Messages to Students</h2>

      {/* Student List */}
      <ul className="list-group">
        {students.map((student) => (
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
        ))}
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
