import React, { useState } from "react";
import FetchContext from "./fetchContex";

export default function FetchState(props) {
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const api_url = import.meta.env.VITE_URL;
  const access_code = import.meta.env.VITE_ACCESS_CODE;

  // fetchStuRecord will fetch all student records
  const fetchStuRecord = async () => {
    try {
      const response = await fetch(`${api_url}/students/fetchstudents`, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const json = await response.json();
      setStudents(json);
    } catch (err) {
      console.log(err.message);
    }
  };

  // fetchNotification function will fetch all notifications
  const fetchNotification = async () => {
    try {
      const response = await fetch(`${api_url}/send-message/fetchnotification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_code: access_code,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const json = await response.json();
      setNotifications(json);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <FetchContext.Provider value={{ students, setStudents, notifications, setNotifications, fetchStuRecord, fetchNotification }}>
      {props.children}
    </FetchContext.Provider>
  );
}