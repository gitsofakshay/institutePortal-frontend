import { useState, useContext, useEffect, useMemo } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";
import FetchContext from "../context/fetchStudentRecord/fetchContex";

export default function AddStudent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const api_url = import.meta.env.VITE_URL;

  const { students, setStudents, fetchStuRecord } = useContext(FetchContext);
  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);

  useEffect(() => {
    fetchStuRecord();
  },[]);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debounceFilterStudents(value);
  };

  const filterStudents = (query) => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const debounceFilterStudents = useMemo(() => debounce(filterStudents, 300), [students]);


  const enrollStudent = async (student) => {
    setLoading(true);
    const updatedStudent = { ...student, enrolled: true };
    await fetch(`${api_url}/api/students/updatestudent/${student._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify(updatedStudent),
    })
      .then((response) => response.json())
      .then((student) => {
        setLoading(false);
        showAlert(student.msg, "success");
        fetchStuRecord();
      })
      .catch((error) => {
        setLoading(false);
        showAlert(error.message, "danger");
        console.error("Error enrolling student:", error);
      });
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
        New Registered Students for Enquiry
      </h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="space-y-4">
        {filteredStudents.filter((student) => !student.enrolled).length > 0 ? (
          filteredStudents
            .filter((student) => !student.enrolled)
            .map((student) => (
              <div
                key={student._id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row justify-between bg-white"
              >
                <div className="text-gray-700 space-y-1">
                  <p><span className="font-semibold">Name:</span> {student.name}</p>
                  <p><span className="font-semibold">Email:</span> {student.email}</p>
                  <p><span className="font-semibold">Phone:</span> {student.phone}</p>
                  <p><span className="font-semibold">DOB:</span> {student.dob}</p>
                  <p><span className="font-semibold">Gender:</span> {student.gender}</p>
                  <p><span className="font-semibold">Course:</span> {student.course}</p>
                  <p><span className="font-semibold">Address:</span> {student.address}</p>
                </div>
                <div className="flex flex-col md:items-end gap-2 mt-4 md:mt-0">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition"
                    onClick={() => enrollStudent(student)}
                  >
                    Add Student
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
                    onClick={() => deleteStudent(student._id)}
                  >
                    Remove Student
                  </button>
                </div>
              </div>
            ))
        ) : (
          <p className="text-center text-gray-500">No records to show</p>
        )}
      </div>
    </div>
  );
}
