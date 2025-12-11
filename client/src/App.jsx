import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import TripsListPage from "./pages/TripsListPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import TripCreatePage from "./pages/TripCreatePage.jsx";
import MatchPage from "./pages/MatchPage";
import BookingsPage from "./pages/BookingsPage";

import "./App.css";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="app-root">
                    <Navbar />
                    <main className="app-content">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/trips"
                                element={
                                    <ProtectedRoute>
                                        <TripsListPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/trips/new"
                                element={
                                    <ProtectedRoute>
                                        <TripCreatePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/trips/:id"
                                element={
                                    <ProtectedRoute>
                                        <TripDetailsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/match"
                                element={
                                    <ProtectedRoute>
                                        <MatchPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/bookings"
                                element={
                                    <ProtectedRoute>
                                        <BookingsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/" element={<Navigate to="/trips" replace />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;