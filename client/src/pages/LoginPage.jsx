import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("paula@example.com");
    const [password, setPassword] = useState("password1");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            navigate("/trips");
        } catch (err) {
            console.error(err);
            setError("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2 className="login-title">Login</h2>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                        />
                    </div>

                    <button
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;