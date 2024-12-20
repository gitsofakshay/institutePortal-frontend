import React, { useState, useContext, useEffect } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function AddStudent() {
    const [students, setStudents] = useState([]);
    const api_url = import.meta.env.VITE_URL;
    const alertcontext = useContext(alertContext);
    const loadingcontext = useContext(loadingContext);
    const { showAlert } = alertcontext;
    const { setLoading } = loadingcontext;
    // Fetch student data (API call)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${api_url}/students/fetchstudents`, {
                    method: "GET",
                    headers: {
                        "auth-token": localStorage.getItem('token')
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const json = await response.json();
                setLoading(false);
                setStudents(json);
            } catch (err) {
                setLoading(false);
                showAlert(err.message, 'danger');
            }
        }

        fetchData();
    }, []);

    const enrollStudent = async (student) => {
        setLoading(true);
        const updatedStudent = { ...student, enrolled: true };
        await fetch(`${api_url}/students/updatestudent/${student._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify(updatedStudent),
        })
            .then((response) => response.json())
            .then((student) => {
                setLoading(false);
                showAlert(student.msg, 'success')
            })
            .catch((error) => {
                setLoading(false)
                showAlert(error.message, 'danger')
            });
    };

    const deleteStudent = async (id) => {
        setLoading(true);
        try {
            await fetch(`${api_url}/students/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
            });
            setStudents(students.filter((student) => student._id !== id));
            setLoading(false);
            showAlert("Student Record is deleted successfully", "success");
        } catch (error) {
            setLoading(false);
            showAlert("Error deleting student", "danger");
            console.error("Error deleting student:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">New Registered Students for Enquiry </h2>
            <ul className="list-group mb-3">
                {students.filter(student => student.enrolled === false).length > 0 ? (
                    students.filter(student => student.enrolled === false) // Filter for non-enrolled students
                        .map((student) => (
                            <li
                                key={student._id}
                                className="list-group-item d-flex flex-column flex-md-row flex-wrap justify-content-between align-items-start my-2"
                            >
                                <div className="mb-2 mb-md-0">
                                    <strong>Name:</strong> {student.name} <br />
                                    <strong>Email:</strong> {student.email} <br />
                                    <strong>Phone:</strong> {student.phone} <br />
                                    <strong>DOB:</strong> {student.dob} <br />
                                    <strong>Gender:</strong> {student.gender} <br />
                                    <strong>Course:</strong> {student.course} <br />
                                    <strong>Address:</strong> {student.address}
                                </div>
                                <div className="mt-2 mt-md-0">
                                    <button className="btn btn-success btn-sm me-2" onClick={() => enrollStudent(student)}>Add Student</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteStudent(student._id)}>Remove Student</button>
                                </div>
                            </li>
                        ))
                ) : (
                    <p className="text-center my-3">No records to show</p>
                )}
            </ul>
        </div>
    )
}
