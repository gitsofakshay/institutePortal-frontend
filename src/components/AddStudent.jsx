import { useState, useContext } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function AddStudent() {
  const [newStudent, setNewStudent] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
    gender: "",
    course: "",
    address: "",
    enrolled: true,
  });
  const api_url = import.meta.env.VITE_URL;
  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);
  const [loading, setLocalLoading] = useState(false);

  const addStudent = async () => {
    const { name, dob, email, phone, gender, course, address } = newStudent;

    // Simple validation
    if (!name || !dob || !email || !phone || !gender || !course || !address) {
      showAlert("Please fill all fields", "danger");
      return;
    }

    setLoading(true);
    setLocalLoading(true);
    await fetch(`${api_url}/api/students/addstudent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify(newStudent),
    })
      .then((response) => response.json())
      .then((student) => {
        setLoading(false);
        setLocalLoading(false);
        showAlert(student.msg, "success");
        setNewStudent({
          name: "",
          dob: "",
          email: "",
          phone: "",
          gender: "",
          course: "",
          address: "",
          enrolled: true,
        });
      })
      .catch((error) => {
        setLoading(false);
        setLocalLoading(false);
        showAlert(error.message, "danger");
      });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Student</h2>

      <input
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        placeholder="Name"
        value={newStudent.name}
        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
      />

      <input
        type="date"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        placeholder="Date of Birth"
        value={newStudent.dob}
        onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
      />

      <select
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        value={newStudent.gender}
        onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
      >
        <option value="" disabled>
          Select gender
        </option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <select
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        value={newStudent.course}
        onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
      >
        <option value="" disabled>
          Select course
        </option>
        <option value="BCA">BCA</option>
        <option value="B.com">B.com</option>
        <option value="DCA">DCA</option>
        <option value="PGDCA">PGDCA</option>
        <option value="Tally">Tally</option>
        <option value="MS Office">MS Office</option>
      </select>

      <input
        type="email"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        placeholder="Email"
        value={newStudent.email}
        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
      />

      <input
        type="tel"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        placeholder="Phone"
        value={newStudent.phone}
        onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
      />

      <textarea
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        rows="3"
        placeholder="Address"
        value={newStudent.address}
        onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
      ></textarea>

      <div className="flex justify-center">
        <button
          onClick={addStudent}
          disabled={loading}
          className={`w-full md:w-auto px-6 py-2 rounded-md text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </div>
    </div>
  );
}
