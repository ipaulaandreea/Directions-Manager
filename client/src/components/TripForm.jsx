import React from "react";
import "../pages/TripCreatePage.css";

const TripForm = ({
                      title,
                      form,
                      setForm,
                      error,
                      onSubmit,
                      submitLabel = "Save",
                      onCancel,
                      cancelLabel = "Cancel",
                  }) => {
    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    return (
        <div className="trip-create-page">
            <div className="trip-create-container">
                <h2 className="trip-create-title">{title}</h2>

                {error && <div className="trip-create-error">{error}</div>}

                <form className="trip-create-form" onSubmit={onSubmit}>
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
                        <button type="submit" className="btn-primary">
                            {submitLabel}
                        </button>

                        <button type="button" className="btn-secondary" onClick={onCancel}>
                            {cancelLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TripForm;