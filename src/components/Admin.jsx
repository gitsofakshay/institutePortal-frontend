import { useState } from "react";
import Notifications from "./Notification";
import Message from "./Message";
import StudentsRecord from "./StudentsRecord";
import AddStudent from './AddStudent';
import EnrollStudent from './EnrollStudent';
import FacultyRecord from "./FacultyRecords";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("notifications");
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case "notifications":
        return <Notifications />;
      case "message":
        return <Message />;
      case "showStudents":
        return <StudentsRecord />;
      case "addStudent":
        return <AddStudent />;
      case "enrollStudent":
        return <EnrollStudent />;
      case "faculty":
        return <FacultyRecord />;
      default:
        return <Notifications />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
        >
          Logout
        </button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-2 text-sm font-medium text-gray-600">
          {[
            { key: "notifications", label: "Notifications" },
            { key: "message", label: "Send Message" },
            { key: "showStudents", label: "Students Record" },
            { key: "addStudent", label: "Add Student" },
            { key: "enrollStudent", label: "New Registration Enquiry" },
            { key: "faculty", label: "Manage Faculty" }

          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-t-md transition duration-200 ${
                activeTab === key
                  ? "bg-white border border-b-0 border-gray-300 text-blue-600"
                  : "bg-gray-100 text-gray-700 hover:text-blue-600"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white p-4 shadow-md rounded-b-md mt-2">
        {renderContent()}
      </div>
    </div>
  );
}
