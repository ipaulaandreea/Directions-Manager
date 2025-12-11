import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import "./TripCreatePage.css";

const TripCreatePage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        origin: "",
        destination: "",
        departureTime: "",
        availableSeats: 1,
        price: "",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await api.post("/trips", {
                ...form,
                availableSeats: Number(form.availableSeats),
                price: form.price ? Number(form.price) : null,
            });
            navigate("/trips");
        } catch (err) {
            console.error(err);
            setError("Failed to create trip");
        }
    };

    return (
        <div className="trip-create-page">
            <div className="trip-create-container">
                <h2 className="trip-create-title">Create trip</h2>

                {error && (
                    <div className="trip-create-error">
                        {error}
                    </div>
                )}

                <form className="trip-create-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Origin</label>
                        <input
                            className="form-input"
                            name="origin"
                            value={form.origin}
                            onChange={handleChange}
                            placeholder="Piața Victoriei, București"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Destination</label>
                        <input
                            className="form-input"
                            name="destination"
                            value={form.destination}
                            onChange={handleChange}
                            placeholder="Piața Romană, București"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Departure time</label>
                        <input
                            type="datetime-local"
                            className="form-input"
                            name="departureTime"
                            value={form.departureTime}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Available seats</label>
                            <input
                                type="number"
                                min={1}
                                className="form-input"
                                name="availableSeats"
                                value={form.availableSeats}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Price (RON)</label>
                            <input
                                type="number"
                                className="form-input"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="trip-create-actions">
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Create
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/trips")}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TripCreatePage;