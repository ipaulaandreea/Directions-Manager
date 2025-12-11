import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(!!token);

    useEffect(() => {
        const fetchMe = async () => {
            if (!token) {
                setLoadingUser(false);
                return;
            }
            try {
                const res = await api.get("/users/me");
                setUser(res.data);
            } catch (err) {
                console.error(err);
                logout();
            } finally {
                setLoadingUser(false);
            }
        };
        fetchMe();
    }, [token]);

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        const receivedToken = res.data.data;
        localStorage.setItem("token", receivedToken);
        setToken(receivedToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, loadingUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);