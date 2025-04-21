import { useState, useContext } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function AddFeeModal({ student, onClose, onSuccess }) {
  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);
  const [amount, setAmount] = useState("");
  const api_url = import.meta.env.VITE_URL;

  const handleSubmit = async () => {
    if (!amount || isNaN(amount)) {
      return showAlert("Please enter a valid amount", "danger");
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${api_url}/api/students/updatestudent/${student._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({
            fees: { total: Number(amount) },
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        showAlert("Fee added successfully", "success");
        onSuccess();
        onClose();
      } else {
        showAlert(data.error || "Failed to add fee", "danger");
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          Add Fee for {student.name}
        </h3>
        <p className="text-sm mb-2 text-red-600">
          Current Due: ₹{(student.fees?.total || 0) - (student.fees?.paid || 0)}
        </p>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="Enter amount to add"
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Add Fee
          </button>
        </div>
      </div>
    </div>
  );
}
