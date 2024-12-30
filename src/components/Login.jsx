import { React, useState, useRef, useContext } from 'react'
import { json, useNavigate } from 'react-router-dom';
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function Login() {
    const [credentials, setCredentials] = useState({ email: "", password: "", otp: "", title: "Login" });
    const [errorMsg, setErrorMsg] = useState("An unknownn error occured");
    const API_URL = import.meta.env.VITE_URL;
    const navigate = useNavigate();
    const ref = useRef(null);
    const refClose = useRef(null);
    const alertcontext = useContext(alertContext);
    const loadingcontext = useContext(loadingContext);
    const { showAlert } = alertcontext;
    const { setLoading } = loadingcontext;

    const { email, otp, password, title } = credentials;

    //api request to login
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, password: password, otp: otp }),
            });

            const json = await response.json();
            setErrorMsg(json.msg)
            setLoading(false);
            if (json.success) {
                refClose.current.click();// close the modal    
                //Save the auth token and redirect to adming page
                localStorage.setItem('token', json.authToken)
                navigate('/admin')
                showAlert(json.msg, "success");
                setCredentials({ email: "", password: "", otp: "", title: "Login" });
            } else {
                showAlert(json.msg, "danger");
            }
        } catch (error) {
            setLoading(false); // Ensure loading state is always reset
            // Handle network or unexpected errors
            console.error("Login failed:", error);
            showAlert(errorMsg, "danger");
        }
    };

    //api request to send otp
    const sendOtp = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/sendotp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password, title: title }),
            });

            const resStatus = await response.json();
            setErrorMsg(resStatus.msg)
            setLoading(false);
            if (resStatus.success) {
                ref.current.click(); //open modal to enter otp
                showAlert(resStatus.msg, 'success')                
            } else {
                showAlert(resStatus.msg, 'danger');
            }
        } catch (error) {
            setLoading(false);
            // Handle network or unexpected errors
            console.error("Login failed:", error);
            showAlert(errorMsg, "danger");            
        }
    }

    //handle input change
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    //redirect to change password page
    const changePassword = () => {
        navigate('/changePassword');
    }

    //redirect to change email page
    const changeEmail = () => {
        navigate('/changeEmail');
    }

    return (
        <>
            <div className='container'>
                <h2 className='text-center my-5'>Login As a Admin</h2>
                <div className='container' style={{ maxWidth: "600px" }}>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="email" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChange} required />
                        </div>
                        <button type="button" className="btn btn-primary mx-2 my-2" onClick={sendOtp}>Login</button>
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
                            <button disabled={otp.length < 5} type="button" className="btn btn-primary" onClick={handleSubmit}>Verify OTP</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
