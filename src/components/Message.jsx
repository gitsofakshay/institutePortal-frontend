import { useState, useEffect, useContext, useCallback } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";
import FetchContext from "../context/fetchStudentRecord/fetchContex";

export default function Message() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");

  const { students, fetchStuRecord } = useContext(FetchContext);
  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);
  const api_url = import.meta.env.VITE_URL;

  useEffect(() => {
    fetchStuRecord();
  }, [fetchStuRecord]);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  const filterStudents = useCallback((query) => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students]);

  // Debounced filter using timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      filterStudents(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filterStudents]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setMessage("");
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      showAlert("Message cannot be empty.", "danger");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${api_url}/api/send-message/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ studentId: selectedStudent._id, message }),
      });

      setSelectedStudent(null);
      const data = await response.json();
      setLoading(false);
      showAlert(data.msg, "success");
    } catch (error) {
      setLoading(false);
      showAlert("Failed to send message.", "danger");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Send Messages to Students</h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          className="w-full max-w-md px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <ul className="space-y-4">
        {filteredStudents.filter((stu) => stu.enrolled).length > 0 ? (
          filteredStudents
            .filter((student) => student.enrolled)
            .map((student) => (
              <li
                key={student._id}
                className="p-4 border rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="text-sm md:text-base space-y-1">
                  <p><strong>Name:</strong> {student.name}</p>
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>Phone:</strong> {student.phone}</p>
                  <p><strong>Course:</strong> {student.course}</p>
                  <p><strong>Gender:</strong> {student.gender}</p>
                  <p><strong>DOB:</strong> {student.dob}</p>
                  <p><strong>Address:</strong> {student.address}</p>
                </div>
                <button
                  className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => openModal(student)}
                >
                  Send Message
                </button>
              </li>
            ))
        ) : (
          <p className="text-center text-gray-500">No enrolled students found.</p>
        )}
      </ul>

      {/* Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Send Message to {selectedStudent.name}
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedStudent(null)}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <textarea
                rows="4"
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setSelectedStudent(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
