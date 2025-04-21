import { useState } from "react";

export default function ManualFeePayment({ student, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [message, setMessage] = useState("");
  const api_url = import.meta.env.VITE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${api_url}/api/students/manual-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({
          studentId: student._id,
          amount: parseFloat(amount),
          method,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Payment failed");
      } else {
        setMessage("Payment successful");
        onSuccess(); // Refresh list
        setTimeout(() => onClose(), 1000);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Manual Fee Payment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p>
            <strong>Student:</strong> {student.name}
          </p>
          <p className="text-sm mb-2 text-red-600">
            Current Due: ₹
            {(student.fees?.total || 0) - (student.fees?.paid || 0)}
          </p>
          <div>
            <label className="block mb-1 font-medium">Amount</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Method</label>
            <select
              className="w-full px-3 py-2 border rounded"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
              <option>Card</option>
            </select>
          </div>
          {message && (
            <p className="text-sm text-center text-red-500">{message}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Pay Fee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
