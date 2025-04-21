import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { loadScript } from "../utils/loadRazorpayScirpt";
import alertContext from "../context/alert/alertContext";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// import { useParams } from "react-router-dom";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState({
    presentCount: 0,
    absentCount: 0,
  });
  const attendanceData = [
    { name: "Present", value: attendance.presentCount },
    { name: "Absent", value: attendance.absentCount },
  ];

  const COLORS = ["#4ade80", "#f87171"];
  const totalDays = attendance.presentCount + attendance.absentCount;
  const attendancePercentage =
    totalDays > 0
      ? ((attendance.presentCount / totalDays) * 100).toFixed(1)
      : 0;

  const [notifications, setNotifications] = useState([]);
  const [amount, setAmount] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const { showAlert } = useContext(alertContext);
  // const {studentId} = useParams()
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth-token"); // or sessionStorage, based on your setup
    navigate("/login"); // redirect to login page
  };

  useEffect(() => {
    fetchProfile();
    fetchAttendance();
    fetchNotifications();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${api}/api/handle-students/profile`, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      });
      setStudent(res.data);
      setAmount(res.data?.fees?.due || 0);
      setPaymentHistory(res.data?.fees?.paymentHistory || []);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${api}/api/handle-students/attendance`, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      });
      setAttendance(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.post(
        `${api}/api/handle-students/fetchnotification`,
        { access_code: import.meta.env.VITE_ACCESS_CODE },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handlePayment = async () => {
    const isLoaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!isLoaded) {
      showAlert("Razorpay SDK failed to load. Are you online?", "danger");
      return;
    }

    try {
      const { data } = await axios.post(
        `${api}/api/fees/initiate-payment`,
        { amount },
        {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        }
      );

      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: "INR",
        name: "Institute Fee Payment",
        description: "Fee Payment",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${api}/api/fees/verify-payment`,
              {
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                amount,
                method: "Razorpay",
              },
              {
                headers: { "auth-token": localStorage.getItem("auth-token") },
              }
            );
            showAlert("Payment successful!", "success");
            fetchProfile();
          } catch (err) {
            console.error("Payment verification failed:", err);
            showAlert("Payment verification failed", "danger");
          }
        },
        prefill: {
          name: student?.name,
          email: student?.email,
          contact: student?.phone,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      showAlert("Failed to initiate payment", "danger");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with Logout */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Student Dashboard
          </h1>
          {student && (
            <h2 className="text-xl text-gray-600 mt-2">
              Welcome, {student.name}!
            </h2>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-around mb-4 border-b">
        {["profile", "attendance", "notifications", "fee"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "profile" && student && (
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Profile</h3>
            <p>
              <strong>Name:</strong> {student.name}
            </p>
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Phone:</strong> {student.phone}
            </p>
            <p>
              <strong>Course:</strong> {student.course}
            </p>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Attendance</h3>
            <p>
              <strong>Present:</strong> {attendance.presentCount}
            </p>
            <p>
              <strong>Absent:</strong> {attendance.absentCount}
            </p>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {attendanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <p className="text-center font-semibold mt-4 text-green-600">
              Attendance Percentage: {attendancePercentage}%
            </p>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Notifications</h3>
            {notifications.length > 0 ? (
              <ul className="list-disc list-inside">
                {notifications.map((note, idx) => (
                  <li key={idx}>{note.message}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No notifications</p>
            )}
          </div>
        )}

        {activeTab === "fee" && (
          <div className="bg-white shadow-md p-4 rounded-lg space-y-2">
            <h3 className="text-xl font-semibold">Fee Payment</h3>
            <p>
              <strong>Due Fee:</strong> ₹{student?.fees?.due || 0}
            </p>
            <input
              type="number"
              className="border px-4 py-2 rounded w-full"
              placeholder="Enter amount to pay"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <button
              onClick={handlePayment}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Pay Fee
            </button>

            {paymentHistory?.length > 0 && (
              <div>
                <h4 className="font-semibold mt-4">Payment History</h4>
                <ul className="list-disc list-inside">
                  {paymentHistory.map((entry, index) => (
                    <li key={index}>
                      ₹{entry.amount} -{" "}
                      {new Date(entry.date).toLocaleDateString()} (
                      {entry.method})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
