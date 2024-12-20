import { useState, useContext } from "react";
import React from 'react'
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
    await fetch(`${api_url}/students/enrollstudent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    })
      .then((response) => response.json())
      .then((student) => {
        setLoading(false);
        showAlert(student.msg, 'success');
        setNewStudent({ name: "", dob: "", email: "", phone: "", gender: "", course: "", address: "", enrolled: false});
      })
      .catch((error) => {
        setLoading(false);
        showAlert(error.message, 'danger');
        setNewStudent({ name: "", dob: "", email: "", phone: "", gender: "", course: "", address: "", enrolled: false});
      });
  }
  return (
    <div className='container' style={{ maxWidth: "800px" }}>
      <h1 className='text-center my-5'>Register for enquiry</h1>
      <form>
        <div className="form-group row my-2">
          <label htmlFor="fullname" className="col-sm-2 col-form-label">Full Name</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="fullname" placeholder="Full Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
          </div>
        </div>
        <div className="form-group row my-2">
          <label htmlFor="inputdob" className="col-sm-2 col-form-label">Date of Birth</label>
          <div className="col-sm-10">
            <input type="date" className="form-control" id="inputdob" placeholder="Date of Birth" value={newStudent.dob} onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })} />
          </div>
        </div>
        <div className="form-group row my-2">
          <label htmlFor="gender" className="col-sm-2 col-form-label">Gender</label>
          <div className="col-sm-10">
            <select id="dender" className="form-select" defaultValue={newStudent.gender} onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}>
              <option value="" disabled>Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="form-group row my-2">
          <label htmlFor="course" className="col-sm-2 col-form-label">Course</label>
          <div className="col-sm-10">
            <select id="course" className="form-select" defaultValue={newStudent.course} onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}>
              <option value="" disabled>Select course</option>
              <option value="BCA">BCA</option>
              <option value="B.com">B.com</option>
              <option value="DCA">DCA</option>
              <option value="PGDCA">PGDCA</option>
              <option value="Tally">Tally</option>
              <option value="MS Office">MS Office</option>
            </select>
          </div>
        </div>
        <div className="form-group row my-2">
          <label htmlFor="inputphone" className="col-sm-2 col-form-label">Phone No</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" id="inputphone" placeholder="Phone No" value={newStudent.phone} onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })} />
          </div>
        </div>
        <div className="form-group row my-2">
          <label htmlFor="inputemail" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input type="email" className="form-control" id="inputemail" placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}/>
          </div>
        </div>
        <div className="form-group row my-2">
          <label htmlFor="address" className="col-sm-2 col-form-label">Address</label>
          <div className="col-sm-10">
            <textarea className="form-control" id="address" rows="3" placeholder="Address" value={newStudent.address} onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}></textarea>
          </div>
        </div>
        <div className="form-group row">
          <div className="d-flex justify-content-center my-2">
            <button type="button" className="btn btn-primary px-5" onClick={enrollStudent}>Register now</button>
          </div>
        </div>
      </form>
    </div>
  )
}
