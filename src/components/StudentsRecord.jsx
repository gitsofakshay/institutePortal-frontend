import { useState, useEffect, useContext, useCallback } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";
import FetchContext from "../context/fetchStudentRecord/fetchContex";
import UpdateStudent from "./UpdateStudent";
import ManualFeePayment from "./ManualFeePayment";
import AddFeeModal from "./AddFeeModal";

export default function StudentsRecord() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isAddFeeModalOpen, setIsAddFeeModalOpen] = useState(false);

  const api_url = import.meta.env.VITE_URL;
  const { students, setStudents, fetchStuRecord } = useContext(FetchContext);
  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);

  useEffect(() => {
    fetchStuRecord();
  }, [fetchStuRecord]);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  // Filter logic
  const filterStudents = useCallback(
    (query) => {
      const filtered = students.filter((student) =>
        student.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStudents(filtered);
    },
    [students]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      filterStudents(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filterStudents]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUpdateClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleFeeClick = (student) => {
    setSelectedStudent(student);
    setIsFeeModalOpen(true);
  };

  const handleCloseFeeModal = () => {
    setIsFeeModalOpen(false);
    setSelectedStudent(null);
  };

  const deleteStudent = async (id) => {
    setLoading(true);
    try {
      await fetch(`${api_url}/api/students/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });

      const updatedList = students.filter((student) => student._id !== id);
      setStudents(updatedList);
      setFilteredStudents(updatedList);
      showAlert("Student record deleted successfully", "success");
    } catch (error) {
      showAlert("Error deleting student", "danger");
      console.error("Error deleting student:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">Students Record</h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          className="w-full max-w-md px-4 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search students..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <ul className="space-y-4">
        {filteredStudents.filter((student) => student.enrolled).length > 0 ? (
          filteredStudents
            .filter((student) => student.enrolled)
            .map((student) => (
              <li
                key={student._id}
                className="p-4 border rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="text-sm md:text-base space-y-1">
                  <p>
                    <strong>Name:</strong> {student.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {student.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {student.phone}
                  </p>
                  <p>
                    <strong>DOB:</strong> {student.dob}
                  </p>
                  <p>
                    <strong>Gender:</strong> {student.gender}
                  </p>
                  <p>
                    <strong>Course:</strong> {student.course}
                  </p>
                  <p>
                    <strong>Address:</strong> {student.address}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Total Fee:</span> ₹
                    {student.fees?.total || 0}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Paid:</span> ₹
                    {student.fees?.paid || 0}
                  </p>
                  <p className="text-sm text-red-600">
                    <span className="font-semibold">Due:</span> ₹
                    {(student.fees?.total || 0) - (student.fees?.paid || 0)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Fee: </span>
                    {student.fees.due === 0 ? (
                      <span className="text-green-600">Fully Paid</span>
                    ) : (
                      <span className="text-red-600">Pending</span>
                    )}
                  </p>
                </div>

                <div className="mt-4 md:mt-0 flex gap-2">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => handleUpdateClick(student)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => deleteStudent(student._id)}
                  >
                    Delete
                  </button>

                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => handleFeeClick(student)}
                  >
                    Pay Fee
                  </button>
                  <button
                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsAddFeeModalOpen(true);
                    }}
                  >
                    Add Fee
                  </button>
                </div>
              </li>
            ))
        ) : (
          <p className="text-center text-gray-500">
            No enrolled students found.
          </p>
        )}
      </ul>

      {/* Update Modal */}
      {isModalOpen && (
        <UpdateStudent
          student={selectedStudent}
          onClose={handleCloseModal}
          setStudents={setStudents}
          students={students}
        />
      )}

      {/* Manual fee payment modal */}
      {isFeeModalOpen && selectedStudent && (
        <ManualFeePayment
          student={selectedStudent}
          onClose={handleCloseFeeModal}
          onSuccess={fetchStuRecord}
        />
      )}

      {/* Add student fee */}
      {isAddFeeModalOpen && selectedStudent && (
        <AddFeeModal
          student={selectedStudent}
          onClose={() => {
            setIsAddFeeModalOpen(false);
            setSelectedStudent(null);
          }}
          onSuccess={fetchStuRecord}
        />
      )}
    </div>
  );
}
