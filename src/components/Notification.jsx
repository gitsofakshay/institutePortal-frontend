import React, { useContext, useState } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";
import FetchContext from "../context/fetchStudentRecord/fetchContex";

export default function Notification() {
  const [message, setMessage] = useState("");
  const api_url = import.meta.env.VITE_URL;
  const alertcontext = useContext(alertContext);
  const loadingcontext = useContext(loadingContext);
  const fetchContext = useContext(FetchContext);
  const { showAlert } = alertcontext;
  const { setLoading } = loadingcontext;
  const { fetchNotification } = fetchContext;

  // Send notification to all users
  const sendNotification = () => {
    setLoading(true);
    fetch(`${api_url}/send-message/notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ message }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        showAlert(data.msg, 'success');
        setMessage("");
        fetchNotification(); // Update notifications context state
      })
      .catch((error) => {
        setLoading(false);
        showAlert(error.message, 'danger');
        console.log("Error sending notification:", error);
      });
  };

  return (
    <div className="container">
      <h2>Send Notifications</h2>
      <textarea
        className="form-control mb-3"
        rows="4"
        placeholder="Write your notification here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button className="btn btn-primary" onClick={sendNotification}>
        Send Notification
      </button>
    </div>
  );
}
