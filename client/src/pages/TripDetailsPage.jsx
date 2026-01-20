import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import "./TripDetailsPage.css";
import { useAuth } from "../context/AuthContext";

const TripDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seats, setSeats] = useState(1);
    const [message, setMessage] = useState(null);
    const { user } = useAuth();
    const isOwner =
        user &&
        (trip?.driver_id === user.id || trip?.driver?.id === user.id);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await api.get(`/trips/${id}`);
                setTrip(res.data.data ?? res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

    const handleBook = async () => {
        setMessage(null);
        try {
            await api.post("/bookings", {
                tripId: trip.id,
                seats: Number(seats),
            });
            setMessage("Booking created successfully");
        } catch (err) {
            console.error(err);
            setMessage("Failed to create booking");
        }
    };

    if (loading) {
        return (
            <div className="trip-details-state">
                Loading...
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="trip-details-state">
                Trip not found.
            </div>
        );
    }

    return (
        <div className="trip-details-page">
            <div className="trip-details-container">
                <div className="trip-header">
                    <h2 className="trip-title">
                        {trip.origin} <span>→</span> {trip.destination}
                    </h2>
                    <div className="trip-main-info">
                        <p>
                            <span className="label">Departure:</span>{" "}
                            {trip.departureTime &&
                                new Date(trip.departureTime).toLocaleString()}
                        </p>
                        {trip.driver && (
                            <p>
                                <span className="label">Driver:</span>{" "}
                                {trip.driver.name} ({trip.driver.email})
                            </p>
                        )}
                        <p>
                            <span className="label">Seats:</span>{" "}
                            {trip.availableSeats}
                        </p>
                        {trip.price && (
                            <p>
                                <span className="label">Price:</span>{" "}
                                {trip.price} RON
                            </p>
                        )}
                    </div>
                {isOwner ? (
                    <div className="owner-actions">
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={() => navigate(`/trips/${trip.id}/edit`)}
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={async () => {
                                const ok = window.confirm("Delete this trip?");
                                if (!ok) return;
                                try {
                                    await api.delete(`/trips/${trip.id}`);
                                    navigate("/trips", { replace: true });
                                } catch (e) {
                                    console.error(e);
                                    setMessage("Failed to delete trip");
                                }
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ) : (
                    <div className="trip-booking-section">
                        <h3 className="trip-booking-title">Book this trip</h3>

                        {message && (
                            <div className={`trip-message ${message.startsWith("Failed") ? "error" : "success"}`}>
                                {message}
                            </div>
                        )}

                        <div className="trip-booking-form">
                            <input
                                type="number"
                                min={1}
                                className="seats-input"
                                value={seats}
                                onChange={(e) => setSeats(e.target.value)}
                            />

                            <div className="booking-actions">
                                <button onClick={handleBook} className="book-button">
                                    Book
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/trips")}
                                    className="cancel-button"
                                >
                                    Back to trips
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
            </div>
    );
};

export default TripDetailsPage;