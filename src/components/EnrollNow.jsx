import { useState, useContext } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function EnrollNow() {
  const alertcontext = useContext(alertContext);
  const loadingcontext = useContext(loadingContext);
  const api_url = import.meta.env.VITE_URL;
  const { showAlert } = alertcontext;
  const { setLoading } = loadingcontext;
  const [newStudent, setNewStudent] = useState({ name: "", dob: "", email: "", phone: "", gender: "", course: "", address: "", enrolled: false });

  const enrollStudent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api_url}/api/students/enrollstudent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });

      const student = await response.json();

      if (response.ok) {
        showAlert(student.msg, 'success');
        setNewStudent({ name: "", dob: "", email: "", phone: "", gender: "", course: "", address: "", enrolled: false });
      } else {
        showAlert(student.msg || 'Enrollment failed', 'danger');
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-blue-700 mb-6">Register for Enquiry</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="fullname" className="block font-medium mb-1">Full Name</label>
          <input type="text" id="fullname" placeholder="Full Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="inputdob" className="block font-medium mb-1">Date of Birth</label>
          <input type="date" id="inputdob" value={newStudent.dob} onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="gender" className="block font-medium mb-1">Gender</label>
          <select id="gender" value={newStudent.gender} onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="" disabled>Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label htmlFor="course" className="block font-medium mb-1">Course</label>
          <select id="course" value={newStudent.course} onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="" disabled>Select course</option>
            <option value="BCA">BCA</option>
            <option value="B.com">B.com</option>
            <option value="DCA">DCA</option>
            <option value="PGDCA">PGDCA</option>
            <option value="Tally">Tally</option>
            <option value="MS Office">MS Office</option>
          </select>
        </div>
      
        <div>
          <label htmlFor="inputphone" className="block font-medium mb-1">Phone No</label>
          <input type="tel" id="inputphone" placeholder="Phone No" value={newStudent.phone} onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="inputemail" className="block font-medium mb-1">Email</label>
          <input type="email" id="inputemail" placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="address" className="block font-medium mb-1">Address</label>
          <textarea id="address" rows="3" placeholder="Address" value={newStudent.address} onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
        </div>

        <div className="text-center">
          <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded" onClick={enrollStudent}>Register Now</button>
        </div>
      </form>
    </div>
  )
}
