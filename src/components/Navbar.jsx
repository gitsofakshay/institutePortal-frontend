import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isInboxOpen, setIsInboxOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const api_url = import.meta.env.VITE_URL;
    const access_code = import.meta.env.VITE_ACCESS_CODE;
    
    const handleLogin = () => {
        navigate('/login');
    }

    useEffect(() => {
        const fetchData = async () => {
            try {                                            
                // setLoading(true);
                const response = await fetch(`${api_url}/send-message/fetchnotification`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        access_code: access_code,
                    }),
                });
                if (!response.ok) {                    
                    throw new Error(`Error: ${response.status}`);
                }
                const json = await response.json();
                // setLoading(false);
                setNotifications(json);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchData();
    }, []);

    const toggleInbox = () => setIsInboxOpen(!isInboxOpen);
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ "padding": "10px 18px" }}>
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/" style={{ "color": " #00ff5f", "fontSize": " 1.2rem", "fontFamily": " monospace" }}>Maharaja Agrasen Institute</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/Courses' ? 'active' : ''}`} to="/Courses">Courses</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/FeeStructure' ? 'active' : ''}`} to="/FeeStructure">Fee Structure</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/EnrollNow' ? 'active' : ''}`} to="/EnrollNow">Enroll Now</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary mx-2" onClick={handleLogin}>Login</button>
                        {/* Inbox Button with Notification Count */}
                        <button type="button" className="btn btn-primary position-relative mx-2" onClick={toggleInbox}>
                            Inbox
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {notifications.length}
                                <span className="visually-hidden">unread messages</span>
                            </span>
                        </button>
                        {/* Notification Dropdown */}
                        {isInboxOpen && (
                            <div className="dropdown-menu show p-3 shadow position-absolute end-0"
                                style={{ minWidth: "300px", maxWidth: "406px", maxHeight: "auto" }}>
                                <h6 className="dropdown-header" style={{ display: 'inline-block', marginRight: "230px" }}>Notifications</h6>
                                <button type="button" className="btn-close" aria-label="Close" onClick={toggleInbox}></button>
                                {notifications.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {notifications.map((notification,index) => (
                                            <li
                                                key={notification._id}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                            >                                                                                         
                                                {notification.message}
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
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
                                    <p className="text-muted text-center">No new notifications</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    )
}
