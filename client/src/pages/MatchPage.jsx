import React, { useState } from "react";
import api from "../api/axiosClient";
import { Link } from "react-router-dom";
import "./MatchPage.css";

const MatchPage = () => {
    const [pickupAddress, setPickupAddress] = useState("");
    const [destinationAddress, setDestinationAddress] = useState("");
    const [maxDistance, setMaxDistance] = useState(10000);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleMatch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMatches([]);
        try {
            const res = await api.post("/matches/match", {
                pickupAddress: pickupAddress,
                destinationAddress: destinationAddress,
                maxDistance: Number(maxDistance),
            });
            setMatches(res.data.matches ?? []);
        } catch (err) {
            console.error(err);
            alert("Match request failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="match-page">
            <div className="match-container">
                <h2 className="match-title">Find matching trips</h2>

                <form className="match-form" onSubmit={handleMatch}>
                    <div className="form-group">
                        <label className="form-label">Pickup address</label>
                        <input
                            className="form-input"
                            value={pickupAddress}
                            onChange={(e) => setPickupAddress(e.target.value)}
                            placeholder="Strada Mihai Eminescu 25, București"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Destination address</label>
                        <input
                            className="form-input"
                            value={destinationAddress}
                            onChange={(e) => setDestinationAddress(e.target.value)}
                            placeholder="Piața Romană, București"
                        />
                    </div>

                    <div className="form-group small">
                        <label className="form-label">Max distance (meters)</label>
                        <input
                            type="number"
                            min={0}
                            className="form-input"
                            value={maxDistance}
                            onChange={(e) => setMaxDistance(e.target.value)}
                        />
                    </div>

                    <button
                        className="match-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Find matches"}
                    </button>
                </form>

                <h3 className="match-results-title">Results</h3>

                {loading ? (
                    <div className="match-loading">Loading...</div>
                ) : matches.length === 0 ? (
                    <div className="match-empty">No matches found.</div>
                ) : (
                    <div className="match-list">
                        {matches.map((m) => (
                            <div key={m.tripId} className="match-card">
                                <div className="match-info">
                                    <div className="match-route">
                                        {m.origin} <span>→</span> {m.destination}
                                    </div>
                                    <div className="match-meta">
                                        <div className="match-meta-item">
                                            <span className="label">Departure:</span>
                                            <span>
                                                {m.departureTime &&
                                                    new Date(m.departureTime).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="match-meta-item">
                                            <span className="label">Seats:</span>
                                            <span>
                                                {m.availableSeats}
                                                {m.price && ` · ${m.price} RON`}
                                            </span>
                                        </div>
                                        <div className="match-meta-item">
                                            <span className="label">Pickup distance:</span>
                                            <span>{Math.round(m.pickupDistance_meters)} m</span>
                                        </div>
                                        <div className="match-meta-item">
                                            <span className="label">Destination distance:</span>
                                            <span>{Math.round(m.destinationDistance_meters)} m</span>
                                        </div>
                                    </div>
                                </div>
                                <Link to={`/trips/${m.tripId}`} className="match-view-btn">
                                    View trip
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatchPage;