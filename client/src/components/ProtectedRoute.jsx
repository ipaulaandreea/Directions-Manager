import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ProtectedRoute.css";

const ProtectedRoute = ({ children }) => {
    const { token, loadingUser } = useAuth();

    if (loadingUser) {
        return (
            <div className="loading-user">
                Loading user...
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;