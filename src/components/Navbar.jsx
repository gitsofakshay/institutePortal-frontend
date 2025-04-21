import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FetchContext from "../context/fetchStudentRecord/fetchContex";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const { notifications, setNotifications, fetchNotification } =
    useContext(FetchContext);

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    fetchNotification();
  }, [fetchNotification]);  
  
  const toggleInbox = () => setIsInboxOpen(!isInboxOpen);

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <nav className="max-w-screen-xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <Link to="/" className="text-lime-400 text-xl font-mono font-semibold">
          Akshay Institutes
        </Link>
        <div className="flex items-center space-x-4 mt-3 md:mt-0">
          <ul className="hidden md:flex space-x-6 text-sm font-medium">
            <li>
              <Link
                to="/"
                className={`${
                  location.pathname === "/" ? "text-lime-400" : "text-white"
                } hover:text-lime-300`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/Courses"
                className={`${
                  location.pathname === "/Courses"
                    ? "text-lime-400"
                    : "text-white"
                } hover:text-lime-300`}
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                to="/FeeStructure"
                className={`${
                  location.pathname === "/FeeStructure"
                    ? "text-lime-400"
                    : "text-white"
                } hover:text-lime-300`}
              >
                Fee Structure
              </Link>
            </li>
            <li>
              <Link
                to="/EnrollNow"
                className={`${
                  location.pathname === "/EnrollNow"
                    ? "text-lime-400"
                    : "text-white"
                } hover:text-lime-300`}
              >
                Enroll Now
              </Link>
            </li>
          </ul>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm"
            onClick={handleLogin}
          >
            Login
          </button>

          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm mx-2"
            onClick={() => navigate("/signup")}
          >
            Signup
          </button>

          <div className="relative">
            <button
              onClick={toggleInbox}
              className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm"
            >
              Inbox
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {isInboxOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-md shadow-lg z-50">
                <div className="flex justify-between items-center p-3 border-b">
                  <h6 className="font-semibold">Notifications</h6>
                  <button
                    onClick={toggleInbox}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <ul className="divide-y">
                      {notifications.map((notification, index) => (
                        <li
                          key={notification._id}
                          className="p-3 flex justify-between items-start text-sm"
                        >
                          <span>{notification.message}</span>
                          <button
                            className="text-red-500 text-lg leading-none"
                            onClick={() =>
                              setNotifications((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                          >
                            &times;
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-gray-500 py-4 text-sm">
                      No new notifications
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
