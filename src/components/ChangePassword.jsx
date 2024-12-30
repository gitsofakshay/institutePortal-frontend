import { React, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function Login() {
    const [credentials, setCredentials] = useState({ email: "", otp: "", oldPassword: "", newPassword: "", title: "Password Change"})
    const API_URL = import.meta.env.VITE_URL;
    const navigate = useNavigate();
    const alertcontext = useContext(alertContext);
    const loadingcontext = useContext(loadingContext);
    const { showAlert } = alertcontext;
    const { setLoading } = loadingcontext;

    const { email, otp, oldPassword, newPassword, title} = credentials;

    //api request to change password
    const changePassword = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/changepassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, otp: otp, newPassword: newPassword }),
            });
            
            setLoading(false)
            const json = await response.json();
            if (json.success) {
                setCredentials({ email: "", otp: "" , oldPassword: "", newPassword: "", title: "Password Change"})
                navigate('/login')          
                showAlert(json.msg, "success");      
            } else {
                showAlert(json.msg, "danger");
            }
        } catch (error) {
            setLoading(false); // Ensure loading state is always reset
            // Handle network or unexpected errors
            console.error("Login failed:", error);
            showAlert("Failed to login. Please try again later.", "danger");
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
                body: JSON.stringify({ email: email, password: oldPassword, title: title}),
            });
    
            const json = await response.json()
    
            setLoading(false);
            if (json.success) {
                showAlert(json.msg, "success")
            } else {
                showAlert(json.msg, "danger")
            }
        } catch (error) {
            setLoading(false); // Ensure loading state is always reset
            // Handle network or unexpected errors
            console.error("Login failed:", error);
            showAlert("Failed to login. Please try again later.", "danger")
        }
    }

    //handle input change
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <>
            <div className='container'>
                <h2 className='text-center my-5'>Change your password</h2>
                <div className='container' style={{ maxWidth: "600px" }}>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="email" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="oldPassword" className="form-label">Old Password</label>
                            <input type="password" className="form-control" id="oldPassword" name='oldPassword' value={credentials.oldPassword} onChange={onChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <input type="password" className="form-control" id="newPassword" name='newPassword' value={credentials.newPassword} onChange={onChange} required />
                        </div>
                        <button type="button" className="btn btn-primary mx-2 my-2" onClick={sendOtp}>Send OTP</button>
                        <div className="mb-3">
                            <label htmlFor="otp" className="form-label">Enter OTP</label>
                            <input type="number" className="form-control" id="otp" name='otp' value={credentials.otp} onChange={onChange} required />
                        </div>
                        <button disabled={otp.length < 6}  type="button" className="btn btn-primary mx-2 my-2" onClick={changePassword}>Change Password</button>
                    </form>
                </div>
            </div>
        </>
    )
}
