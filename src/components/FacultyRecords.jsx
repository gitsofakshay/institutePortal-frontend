import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Alert from "./Alert";
import Loading from "./Loading";

export default function FacultyRecord() {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    courses: "",
    address: "",
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    courses: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const api_url = import.meta.env.VITE_URL;
  const token = localStorage.getItem("auth-token");
  const config = {
    headers: {
      "auth-token": token,
      "Content-Type": "application/json",
    },
  };

  const fetchFaculty = async () => {
    try {
      const res = await axios.get(
        `${api_url}/api/faculty/fetchfaculty`,
        config
      );
      setFaculty(res.data);
      setFilteredFaculty(res.data);
    } catch (err) {
      console.error("Error fetching faculty:", err);
    }
  };

  const handleAdd = async () => {
    const payload = {
      ...newFaculty,
      courses: newFaculty.courses.split(/[\s,]+/).filter(Boolean),
    };

    try {
      const res = await axios.post(
        `${api_url}/api/faculty/addfaculty`,
        payload,
        config
      );
      const updatedList = [...faculty, res.data.savedFaculty];
      setFaculty(updatedList);
      setFilteredFaculty(updatedList);
      setNewFaculty({
        name: "",
        email: "",
        phone: "",
        department: "",
        courses: "",
        address: "",
      });
      showAlert("Faculty added successfully", "success");
    } catch (err) {
      console.error("Error adding faculty:", err);
      showAlert("Failed to add faculty", "danger");
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${api_url}/api/faculty/deletefaculty/${id}`, config);
      const updatedList = faculty.filter((f) => f._id !== id);
      setFaculty(updatedList);
      setFilteredFaculty(updatedList);
      showAlert("Faculty deleted", "warning");
    } catch (err) {
      console.error("Error deleting faculty:", err);
      showAlert("Failed to delete faculty", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    const payload = {
      ...editData,
      courses: editData.courses.split(/[\s,]+/).filter(Boolean),
    };

    try {
      const res = await axios.put(
        `${api_url}/api/faculty/updatefaculty/${id}`,
        payload,
        config
      );
      const updatedList = faculty.map((f) =>
        f._id === id ? res.data.updatedRecord : f
      );
      setFaculty(updatedList);
      setFilteredFaculty(updatedList);
      setEditId(null);
      showAlert("Faculty updated successfully", "success");
    } catch (err) {
      console.error("Error updating faculty:", err);
      showAlert("Failed to update faculty", "danger");
    }
  };

  const filterFaculty = useCallback(
    (query) => {
      const filtered = faculty.filter((f) =>
        f.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFaculty(filtered);
    },
    [faculty]
  );

  useEffect(() => {
    fetchFaculty();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      filterFaculty(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterFaculty]);

  const showAlert = (msg, type = "info") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <Alert alert={alert} />
      {loading && <Loading />}

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Faculty Management Panel
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <section className="lg:w-1/2 bg-white rounded-lg shadow p-6 space-y-4 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700">
            Add New Faculty
          </h3>

          <div className="space-y-3">
            {[
              { label: "Name", name: "name", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone (10 digits)", name: "phone", type: "tel" },
              { label: "Department", name: "department", type: "text" },
              {
                label: "Courses (comma-separated)",
                name: "courses",
                type: "text",
              },
              { label: "Address", name: "address", type: "text" },
            ].map((field) => (
              <input
                key={field.name}
                type={field.type}
                placeholder={field.label}
                value={newFaculty[field.name]}
                onChange={(e) =>
                  setNewFaculty({ ...newFaculty, [field.name]: e.target.value })
                }
                className="input input-bordered w-full"
              />
            ))}

            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Faculty
            </button>
          </div>
        </section>

        <section className="lg:w-1/2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-700">
              Faculty Records
            </h3>
            <input
              type="text"
              placeholder="Search faculty by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {filteredFaculty.length > 0 ? (
            filteredFaculty.map((f) => (
              <div
                key={f._id}
                className="flex justify-between items-start gap-4 bg-white p-4 rounded-md shadow-sm border border-gray-200"
              >
                {editId === f._id ? (
                  <div className="flex-1 space-y-2">
                    {[
                      { label: "Name", name: "name", type: "text" },
                      { label: "Email", name: "email", type: "email" },
                      { label: "Phone", name: "phone", type: "tel" },
                      { label: "Department", name: "department", type: "text" },
                      {
                        label: "Courses (comma-separated)",
                        name: "courses",
                        type: "text",
                      },
                      { label: "Address", name: "address", type: "text" },
                    ].map((field) => (
                      <input
                        key={field.name}
                        type={field.type}
                        value={editData[field.name]}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            [field.name]: e.target.value,
                          })
                        }
                        placeholder={field.label}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 space-y-1">
                    <p className="text-base font-medium text-gray-800">
                      {f.name}
                    </p>
                    <p className="text-sm text-gray-500">{f.email}</p>
                    <p className="text-sm text-gray-500">{f.phone}</p>
                    <p className="text-sm text-gray-500">{f.department}</p>
                    <p className="text-sm text-gray-500">
                      {Array.isArray(f.courses)
                        ? f.courses.join(", ")
                        : f.courses}
                    </p>
                    <p className="text-sm text-gray-500">{f.address}</p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {editId === f._id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(f._id)}
                        className="text-green-600 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="text-gray-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(f._id);
                          setEditData({
                            name: f.name,
                            email: f.email,
                            phone: f.phone,
                            department: f.department,
                            courses: Array.isArray(f.courses)
                              ? f.courses.join(", ")
                              : f.courses,
                            address: f.address,
                          });
                        }}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No faculty found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
