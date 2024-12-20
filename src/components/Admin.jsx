import React, { useState } from "react";
import Notifications from "./Notification";
import Message from "./Message";
import StudentsRecord from "./StudentsRecord";
import AddStudent from './AddStudent';
import EnrollStudent from './EnrollStudent';
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
      default:
        return <Notifications />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.clear();
    navigate('/');
}

  return (
    <div className="container mt-4">
      <h1 className="mb-2" style={{display:"inline-block",marginRight: '68%'}}>Admin Dashboard</h1>
      <button type="button" className="btn btn-primary" onClick={handleLogout}>Logout</button>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "notifications" ? "active" : ""}`} onClick={() => setActiveTab("notifications")} style={{color: 'black'}}>
            Notifications
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "message" ? "active" : ""}`} onClick={() => setActiveTab("message")} style={{color: 'black'}}>
            Send Message
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "showStudents" ? "active" : ""}`} onClick={() => setActiveTab("showStudents")} style={{color: 'black'}}>
            Students Record
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "addStudent" ? "active" : ""}`} onClick={() => setActiveTab("addStudent")} style={{color: 'black'}}>
            Add Student
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "enrollStudent" ? "active" : ""}`} onClick={() => setActiveTab("enrollStudent")} style={{color: 'black'}}>
            New Registraion Enquiry
          </button>
        </li>
      </ul>
      <div className="mt-4">{renderContent()}</div>
    </div>
  )
}
