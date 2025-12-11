import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";
import "./BookingsPage.css";

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await api.get("/bookings");
            setBookings(res.data.data ?? res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        try {
            await api.delete(`/bookings/${id}`);
            fetchBookings();
        } catch (err) {
            console.error(err);
            alert("Failed to cancel booking");
        }
    };

    const formatDateTime = (iso) => {
        if (!iso) return "-";
        return new Date(iso).toLocaleString("ro-RO", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="bookings-page">
            <div className="bookings-container">
                <h2 className="bookings-title">My bookings</h2>

                {loading ? (
                    <div className="bookings-loading">Loading...</div>
                ) : bookings.length === 0 ? (
                    <div className="bookings-empty">No bookings.</div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map((b) => (
                            <div key={b.id} className="booking-card">
                                <div className="booking-info">
                                    <div className="booking-route">
                                        {b.trip.origin} <span>→</span> {b.trip.destination}
                                    </div>
                                    <div className="booking-meta">
                                        <div className="booking-meta-item">
                                            <span className="label">Departure:</span>
                                            <span>{formatDateTime(b.trip.departureTime)}</span>
                                        </div>
                                        <div className="booking-meta-item">
                                            <span className="label">Seats:</span>
                                            <span>{b.seats}</span>
                                        </div>
                                        <div className="booking-meta-item">
                                            <span className="label">Status:</span>
                                            <span>{b.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCancel(b.id)}
                                    className="booking-cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingsPage;