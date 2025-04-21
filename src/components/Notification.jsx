import { useContext, useState } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";
import FetchContext from "../context/fetchStudentRecord/fetchContex";

export default function Notification() {
  const [message, setMessage] = useState("");
  const api_url = import.meta.env.VITE_URL;
  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);
  const { fetchNotification } = useContext(FetchContext);

  // Send notification to all users
  const sendNotification = () => {
    if (!message.trim()) {
      showAlert("Notification message cannot be empty", "danger");
      return;
    }

    setLoading(true);
    fetch(`${api_url}/api/send-message/notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ message }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        showAlert(data.msg, "success");
        setMessage("");
        fetchNotification(); // Update notifications context state
      })
      .catch((error) => {
        setLoading(false);
        showAlert(error.message, "danger");
        console.error("Error sending notification:", error);
      });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Send Notification</h2>
      <textarea
        className="w-full border border-gray-300 rounded-md p-3 mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        rows="4"
        placeholder="Write your notification here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <div className="text-right">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-md transition-all duration-200"
          onClick={sendNotification}
        >
          Send Notification
        </button>
      </div>
    </div>
  );
}
