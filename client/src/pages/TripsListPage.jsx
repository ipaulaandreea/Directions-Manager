import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";
import "./TripsListPage.css";

const TripsListPage = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const params = {};
            if (origin) params.origin = origin;
            if (destination) params.destination = destination;

            const res = await api.get("/trips/search", { params });
            setTrips(res.data.data ?? res.data);
        } catch (err) {
            console.error(err);
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTrips();
    };

    return (
        <div className="trips-page">
            <div className="trips-container">

                <div className="trips-header">
                    <div>
                        <h2 className="trips-title">Trips</h2>
                        <p className="trips-subtitle">
                            Browse available carpooling trips.
                        </p>
                    </div>
                    <Link to="/trips/new" className="create-trip-btn">
                        + Create trip
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="trips-search-form">
                    <input
                        className="search-input"
                        placeholder="Origin"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                    />
                    <input
                        className="search-input"
                        placeholder="Destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                    <button className="search-btn" type="submit">
                        Search
                    </button>
                </form>

                {loading ? (
                    <div className="trips-state">Loading trips...</div>
                ) : trips.length === 0 ? (
                    <div className="trips-state">No trips found.</div>
                ) : (
                    <div className="trips-list">
                        {trips.map((trip) => (
                            <Link
                                key={trip.id}
                                to={`/trips/${trip.id}`}
                                className="trip-card"
                            >
                                <div className="trip-card-main">
                                    <div className="trip-route">
                                        {trip.origin} <span>→</span> {trip.destination}
                                    </div>
                                    <div className="trip-meta">
                                        <div className="trip-meta-line">
                                            {trip.departureTime &&
                                                new Date(trip.departureTime).toLocaleString()}
                                        </div>
                                        <div className="trip-meta-line">
                                            Driver: {trip.driver?.name ?? "Unknown"}
                                        </div>
                                    </div>
                                </div>
                                <div className="trip-card-side">
                                    {trip.price && (
                                        <div className="trip-price">
                                            {trip.price} RON
                                        </div>
                                    )}
                                    <div className="trip-seats">
                                        Seats: {trip.availableSeats}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TripsListPage;