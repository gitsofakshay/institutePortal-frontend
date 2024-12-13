import React, { useState, useContext } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function UpdateStudent() {
    const [newStudent, setNewStudent] = useState({ name: "", dob: "", email: "", phone: "", gender: "", course: "", address: "" });
    const api_url = import.meta.env.VITE_URL;
    const alertcontext = useContext(alertContext);
    const loadingcontext = useContext(loadingContext);
    const { showAlert } = alertcontext;
    const { setLoading } = loadingcontext;

    const updateStudent = async () => {
        setLoading(true);
        await fetch(`${api_url}/students/addstudent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify(newStudent),
        })
            .then((response) => response.json())
            .then((student) => {
                setLoading(false);
                showAlert(student.msg, 'success');
                setNewStudent({ name: "", dob: "", email: "", phone: "", gender: "", course: "", address: "" });
            })
            .catch((error) => {
                setLoading(false)
                showAlert(error.message, 'danger')
            });
    };
    return (
        <div className='container my-2'>
            <h2>Add new student</h2>
            <input className="form-control mb-3" placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
            <input className="form-control mb-3" placeholder="Date of Birth" value={newStudent.dob} onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })} />
            <div className="mb-3">
                <select id="dropdown" className="form-select" value={newStudent.gender} onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}>
                    <option value="" disabled>Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>                
                </select>
            </div>            
            <div className="mb-3">
                <select id="dropdown" className="form-select" defaultValue={newStudent.course} onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}>
                    <option value="" disabled>Select course</option>
                    <option value="BCA">BCA</option>
                    <option value="B.com">B.com</option>
                    <option value="DCA">DCA</option>
                    <option value="PGDCA">PGDCA</option>
                    <option value="Tally">Tally</option>
                    <option value="MS Office">MS Office</option>
                </select>
            </div>
            <input className="form-control mb-3" placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
            <input className="form-control mb-3" placeholder="Phone" value={newStudent.phone} onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })} />
            <input className="form-control mb-3" placeholder="address" value={newStudent.address} onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })} />
            <div className="d-flex justify-content-center">
                <button className="btn btn-primary " onClick={updateStudent}>Update Record</button>
            </div>
        </div>
    )
}
