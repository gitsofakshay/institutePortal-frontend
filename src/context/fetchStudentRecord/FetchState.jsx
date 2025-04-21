import { useState, useCallback } from "react";
import FetchContext from "./fetchContex";

export default function FetchState(props) {
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const api_url = import.meta.env.VITE_URL;
  const access_code = import.meta.env.VITE_ACCESS_CODE;

  // Fetch all student records
  const fetchStuRecord = useCallback(async () => {
    try {
      const response = await fetch(`${api_url}/api/students/fetchstudents`, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.log("Student fetch error:", err.message);
    }
  }, [api_url]);

  // Fetch all notifications
  const fetchNotification = useCallback(async () => {
    try {
      const response = await fetch(`${api_url}/api/handle-students/fetchnotification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_code }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();      
      setNotifications(data.notifications || []);      
    } catch (err) {
      console.log("Notification fetch error:", err.message);
    }
  }, [api_url, access_code]);

  return (
    <FetchContext.Provider
      value={{
        students,
        setStudents,
        notifications,
        setNotifications,
        fetchStuRecord,
        fetchNotification,
      }}
    >
      {props.children}
    </FetchContext.Provider>
  );
}
