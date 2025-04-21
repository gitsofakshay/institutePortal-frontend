import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function Signup() {
  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_URL;

  const [formData, setFormData] = useState({
    email: "",
    role: "Student",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api_url}/api/otp/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          userType: formData.role,
        }),
      });

      const resData = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("auth-token", resData.authToken); // short-lived
        setShowOtpModal(true);
        showAlert(resData.message || "OTP sent", "success");
      } else {
        showAlert(resData.message || "Failed to send OTP", "danger");
      }
    } catch (err) {
      setLoading(false);
      showAlert(err.message, "danger");
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    const token = localStorage.getItem("auth-token");
    try {
      const response = await fetch(`${api_url}/api/otp/verifyotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          email: formData.email,
          userType: formData.role,
          otp,
        }),
      });

      const resData = await response.json();
      setLoading(false);

      if (response.ok) {
        showAlert(resData.message || "OTP verified", "success");
        localStorage.setItem("auth-token", resData.authToken); // store long-lived
        setIsOtpVerified(true);
        setShowOtpModal(false);
      } else {
        showAlert(resData.message || "OTP verification failed", "danger");
      }
    } catch (err) {
      setLoading(false);
      showAlert(err.message, "danger");
    }
  };

  const handleSignup = async () => {
    if (!isOtpVerified) {
      showAlert("Please verify OTP first", "danger");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showAlert("Passwords do not match", "danger");
      return;
    }

    setLoading(true);
    const endpoint =
      formData.role === 'Faculty'
        ? '/api/faculty/set-password'
        : '/api/student/set-password';
    try {      
      const response = await fetch(`${api_url}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showAlert(result.message || "Password set successfully", "success");
        setFormData({
          email: "",
          role: "Student",
          password: "",
          confirmPassword: "",
        });
        setIsOtpVerified(false);
        localStorage.removeItem("auth-token");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showAlert(result.message || "Signup failed", "danger");
      }
    } catch (error) {
      showAlert(error.message || "Something went wrong", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6">
          Set Your Password
        </h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Enter your registered email"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
          </select>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={sendOtp}
            disabled={!formData.email}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Send OTP
          </button>
        </div>

        {isOtpVerified && (
          <>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Set a password"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Re-enter password"
                required
              />
            </div>

            <button
              onClick={handleSignup}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition"
            >
              Set Password
            </button>
          </>
        )}
      </div>

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
              onChange={(e) => setOtp(e.target.value)}
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
