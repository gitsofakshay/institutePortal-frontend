import { React, useState, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function Login() {
    const [credentials, setCredentials] = useState({ email: "", password: "", otp: "" });
    const API_URL = import.meta.env.VITE_URL;
    const navigate = useNavigate();
    const ref = useRef(null);
    const refClose = useRef(null);
    const alertcontext = useContext(alertContext);
    const loadingcontext = useContext(loadingContext);
    const { showAlert } = alertcontext;
    const { setLoading } = loadingcontext;

    const { email, otp, password } = credentials;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, password: password }),
        });

        const json = await response.json();
        setLoading(false);
        if (json.success) {
            showAlert(json.msg, 'success');
            ref.current.click();
        } else {
            showAlert(json.error, 'danger');
        }
    }

    const verifyOtp = async (e) => {
        e.preventDefault();
        //api request for verification of otp
        setLoading(true);
        const response = await fetch(`${API_URL}/auth/verifyotp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, otp: otp }),
        });

        const resStatus = await response.json();
        setLoading(false);
        if (resStatus.success) {
            refClose.current.click(); //close the modal
            //Save the auth token and redirect
            localStorage.setItem('token', resStatus.authToken)
            showAlert(resStatus.msg, 'success')
            navigate('/admin')
        } else {
            showAlert(resStatus.error, 'danger');
        }
        setCredentials({ email: "", password: "", otp: "" });
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const changePassword = () => {
        showAlert('Password change fecility will be added soon', 'info');
        navigate('/login');
        // ref.current.click();
    }

    const changeEmail = () => {
        showAlert('Email change fecility will be added soon', 'info');
        navigate('/login');
        // ref.current.click();
    }
    return (
        <>
            <div className='container'>
                <h2 className='text-center my-5'>Login As a Admin</h2>
                <div className='container' style={{ maxWidth: "600px" }}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="email" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary mx-2 my-2">Login</button>
                        <button className="btn btn-primary mx-2 my-2" onClick={changePassword}>Change Password</button>
                        <button className="btn btn-primary my-2" onClick={changeEmail}>Change Email</button>
                    </form>
                </div>
            </div>

            {/* Modal */}
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title fs-5" id="exampleModalLabel">Verify OTP sent to your email</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="otp" className="form-label">Enter OTP</label>
                                    <input type="number" className="form-control" id="otp" name='otp' value={otp} onChange={onChange} maxLength={6} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={otp.length < 5} type="button" className="btn btn-primary" onClick={verifyOtp}>Verify OTP</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
