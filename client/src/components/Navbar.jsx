import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">

                <Link to="/" className="navbar-brand">
                    <span className="brand-title">Directions Manager</span>
                    <span className="brand-subtitle">Carpooling app</span>
                </Link>

                {user ? (
                    <div className="navbar-right">
                        <div className="navbar-links">
                            <Link to="/trips" className="nav-link">Trips</Link>
                            <Link to="/match" className="nav-link">Match</Link>
                            <Link to="/bookings" className="nav-link">Bookings</Link>
                        </div>

                        <div className="navbar-user">
                            <span className="user-name">{user.name ?? user.email}</span>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="login-btn">Login</Link>
                )}

            </div>
        </nav>
    );
};

export default Navbar;