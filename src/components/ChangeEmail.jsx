import { useState, useContext } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";
import { useNavigate } from "react-router-dom";

export default function ChangeEmail() {
  const [credentials, setCredentials] = useState({
    email: "", newEmail: "", otp: "", userType: "Admin",
  });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const { email, newEmail, otp, userType } = credentials;
  const API_URL = import.meta.env.VITE_URL;
  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);
  const navigate = useNavigate();

  const onChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    if (!email) return showAlert("Please enter your current email", "danger");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/otp/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userType }),
      });
      const resData = await response.json();
      setLoading(false);

      if (response.ok) {
        setOtpSent(true);
        setShowOtpModal(true);
        showAlert(resData.message, "success");
        localStorage.setItem("auth-token", resData.authToken);
      } else {
        showAlert(resData.message || "Failed to send OTP", "danger");
      }
    } catch (error) {
      setLoading(false);
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
        body: JSON.stringify({ email, userType, otp }),
      });

      const resData = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("auth-token", resData.authToken); // long-lived
        setShowOtpModal(false);
        setOtpVerified(true);
        showAlert(resData.message, "success");
      } else {
        showAlert(resData.message || "OTP verification failed", "danger");
      }
    } catch (error) {
      setLoading(false);
      showAlert(error.message, "danger");
    }
  };

  const handleChangeEmail = async () => {
    if (!otpVerified) return showAlert("Please verify OTP first", "danger");
    if (!newEmail) return showAlert("Please enter a new email", "danger");

    setLoading(true);
    const token = localStorage.getItem("auth-token");

    try {
      const response = await fetch(`${API_URL}/api/auth/changeemail`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ email, newEmail }),
      });

      const json = await response.json();
      setLoading(false);

      if (!response.ok) {
        return showAlert(json.message, "danger");
      }

      showAlert(json.message, "success");
      setCredentials({ email: "", newEmail: "", otp: "", userType: "Admin" });
      setOtpSent(false);
      setOtpVerified(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      showAlert(error.message, "danger");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-700">Change Email (Admin)</h2>

        <label className="block mb-2 font-semibold">Current Email</label>
        <input type="email" name="email" value={email} onChange={onChange}
          className="w-full border px-3 py-2 rounded mb-4" required />

        <label className="block mb-2 font-semibold">New Email</label>
        <input type="email" name="newEmail" value={newEmail} onChange={onChange}
          className="w-full border px-3 py-2 rounded mb-4" required />

        <div className="flex justify-between items-center">
          <button
            onClick={sendOtp}
            disabled={otpSent || !email}
            className={`px-4 py-2 rounded ${
              otpSent ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white`}
          >
            {otpSent ? "OTP Sent" : "Send OTP"}
          </button>

          <button
            onClick={handleChangeEmail}
            disabled={!otpVerified}
            className={`px-4 py-2 rounded ${
              otpVerified ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            } text-white`}
          >
            Change Email
          </button>
        </div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-md">
            <h3 className="text-lg font-bold text-indigo-700 mb-4">Verify OTP</h3>
            <label className="block mb-2 font-medium text-gray-700">Enter OTP:</label>
            <input
              type="number"
              name="otp"
              value={otp}
              onChange={onChange}
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
    </div>
  );
}
