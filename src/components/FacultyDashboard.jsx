import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import alertContext from "../context/alert/alertContext";

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [faculty, setFaculty] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const { showAlert } = useContext(alertContext);
  const api_url = import.meta.env.VITE_URL;
  const navigate = useNavigate();

  const authToken = localStorage.getItem("auth-token");

  // Set up axios default headers
  const axiosConfig = {
    headers: {
      "auth-token": authToken,
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token"); // or sessionStorage, based on your setup
    navigate("/login"); // redirect to login page
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${api_url}/api/faculty/profile`,
          axiosConfig
        );
        setFaculty(res.data);
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse) return;
      try {
        const res = await axios.get(
          `${api_url}/api/faculty/courses/${selectedCourse}/students`,
          axiosConfig
        );
        setStudents(res.data);
        const initialAttendance = {};
        res.data.forEach((student) => {
          initialAttendance[student._id] = "present";
        });
        setAttendance(initialAttendance);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, [selectedCourse]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  const submitAttendance = async () => {
    const presentStudents = Object.entries(attendance)
      .filter(([_, status]) => status === "present")
      .map(([id]) => id);
    const absentStudents = Object.entries(attendance)
      .filter(([_, status]) => status === "absent")
      .map(([id]) => id);

    try {
      await axios.post(
        `${api_url}/api/faculty/courses/${selectedCourse}/attendance`,
        { presentStudents, absentStudents },
        axiosConfig
      );
      showAlert("Attendance submitted successfully!", "success");
    } catch (error) {
      showAlert("Failed submitting attendance", "danger");
      console.error("Error submitting attendance:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Logout */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Faculty Dashboard
          </h1>
          {faculty && (
            <h2 className="text-xl text-gray-600 mt-2">
              Welcome, {faculty.name}
            </h2>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "profile"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "attendance"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Attendance
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white p-6 shadow rounded-xl space-y-4">
          <h2 className="text-xl font-bold">Faculty Profile</h2>
          {faculty ? (
            <>
              <p>
                <strong>Name:</strong> {faculty.name}
              </p>
              <p>
                <strong>Email:</strong> {faculty.email}
              </p>
              <p>
                <strong>Department:</strong> {faculty.department}
              </p>
              <div>
                <strong>Allotted Courses:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {courses.map((course, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <div className="bg-white p-6 shadow rounded-xl space-y-6">
          <h2 className="text-xl font-bold">Mark Attendance</h2>

          {/* Course Selector */}
          <div className="flex flex-wrap gap-3">
            {courses.map((course, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCourse(course)}
                className={`px-4 py-2 rounded-full border ${
                  selectedCourse === course
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {course}
              </button>
            ))}
          </div>

          {/* Student Attendance List */}
          {selectedCourse && (
            <div>
              {students.length > 0 ? (
                <div className="space-y-4">
                  {students.map((student) => (
                    <div
                      key={student._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-3"
                    >
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      <div className="flex gap-4 mt-2 sm:mt-0">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            checked={attendance[student._id] === "present"}
                            onChange={() =>
                              handleAttendanceChange(student._id, "present")
                            }
                          />
                          Present
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            checked={attendance[student._id] === "absent"}
                            onChange={() =>
                              handleAttendanceChange(student._id, "absent")
                            }
                          />
                          Absent
                        </label>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={submitAttendance}
                    className="mt-4 px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                  >
                    Submit Attendance
                  </button>
                </div>
              ) : (
                <p>No students found for this course.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
