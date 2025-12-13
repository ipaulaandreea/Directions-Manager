import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import TripForm from "../components/TripForm";

const TripCreatePage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        origin: "",
        destination: "",
        departureTime: "",
        availableSeats: 1,
        price: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await api.post("/trips", {
                ...form,
                availableSeats: Number(form.availableSeats),
                price: form.price === "" ? null : Number(form.price),
            });
            navigate("/trips");
        } catch (err) {
            console.error(err);
            setError("Failed to create trip");
        }
    };

    return (
        <TripForm
            title="Create trip"
            form={form}
            setForm={setForm}
            error={error}
            onSubmit={handleSubmit}
            submitLabel="Create"
            onCancel={() => navigate("/trips")}
            cancelLabel="Cancel"
        />
    );
};

export default TripCreatePage;