import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    otp: "",
    userType: "Admin",
  });
  const [errorMsg, setErrorMsg] = useState("An unknown error occurred");
  const [showOtpModal, setShowOtpModal] = useState(false); // 🔑 Modal control
  const API_URL = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);
  const { email, password, otp, userType } = credentials;
  const token = localStorage.getItem("auth-token");

  const handleSubmit = async () => {
    setLoading(true);
    let endpoint = "/api/auth/login";
    if (userType === "Admin") {
      endpoint = "/api/auth/login";
    } else if (userType === "Student") {
      endpoint = "/api/handle-students/login";
    } else if (userType === "Faculty") {
      endpoint = "/api/faculty/login";
    }
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();
      setLoading(false);
      setErrorMsg(json.message);
      
      if (response.ok) {        
        setShowOtpModal(false); // 🔒 Hide modal
        localStorage.setItem("auth-token", json.authToken);
        showAlert(json.message, "success");
        setCredentials({
          email: "",
          password: "",
          otp: "",
          userType: userType,
        });

        if (userType === "Admin") navigate("/admin");
        else if (userType === "Student") navigate(`/student/${json.student.id}`);
        else if (userType === "Faculty") navigate(`/faculty/${json.faculty.id}`);
      } else {
        showAlert(json.message, "danger");
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message);
      showAlert(errorMsg, "danger");
      console.log(error)
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/otp/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userType }), // use `userType` instead of `password` & `userType`
      });

      const resData = await response.json();
      setLoading(false);
      setErrorMsg(resData.message); // updated key: message

      if (response.ok) {
        setShowOtpModal(true); // 🔓 Show OTP modal
        showAlert(resData.message, "success");
        localStorage.setItem("auth-token", resData.authToken); // use short-lived token
      } else {
        showAlert(resData.message || "Failed to send OTP", "danger");
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message);
      showAlert(error.message, "danger");
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`${API_URL}/api/otp/verifyotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ email, userType, otp }), // assuming `otp` is from user input
      });

      const resData = await response.json();
      setLoading(false);
      setErrorMsg(resData.message);

      if (response.ok) {
        showAlert(resData.message, "success");
        localStorage.setItem("auth-token", resData.authToken); // store long-lived token
        setShowOtpModal(false); // close modal
        await handleSubmit();
      } else {
        showAlert(resData.message || "OTP verification failed", "danger");
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message);
      showAlert(error.message, "danger");
      console.log(error)
    }
  };

  const onChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const changePassword = () => navigate("/changePassword");
  const changeEmail = () => navigate("/changeEmail");

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
        <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
            Login
          </h2>
          <div className="mb-4">
            <label
              htmlFor="userType"
              className="block mb-1 font-semibold text-gray-600"
            >
              Login as
            </label>
            <select
              name="userType"
              id="userType"
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              value={userType}
              onChange={onChange}
            >
              <option>Admin</option>
              <option>Student</option>
              <option>Faculty</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-1 font-semibold text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={onChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-1 font-semibold text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={onChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              required
            />
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            <button
              type="button"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              onClick={sendOtp}
            >
              Send OTP
            </button>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={changePassword}
            >
              Change Password
            </button>
            <button
              className="text-sm text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={changeEmail}
              disabled={userType === "Student" || userType === "Faculty"}
            >
              Change Email
            </button>
          </div>
        </div>
      </div>

      {/* Tailwind OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-md p-6 relative animate-fade-in">
            <h3 className="text-lg font-bold text-indigo-700 mb-4">
              Verify OTP
            </h3>
            <label
              htmlFor="otp"
              className="block mb-2 font-medium text-gray-700"
            >
              Enter OTP sent to your email:
            </label>
            <input
              type="number"
              name="otp"
              id="otp"
              value={otp}
              onChange={onChange}
              maxLength={6}
              className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={verifyOtp}
                disabled={otp.length < 5}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
