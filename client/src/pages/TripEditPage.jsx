import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosClient";
import TripForm from "../components/TripForm";

const TripEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        origin: "",
        destination: "",
        departureTime: "",
        availableSeats: 1,
        price: "",
    });

    useEffect(() => {
        const fetchTrip = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await api.get(`/trips/${id}`);
                const trip = res.data.data ?? res.data;

                setForm({
                    origin: trip.origin ?? "",
                    destination: trip.destination ?? "",
                    departureTime: trip.departureTime
                        ? new Date(trip.departureTime).toISOString().slice(0, 16)
                        : "",
                    availableSeats: trip.availableSeats ?? 1,
                    price: trip.price ?? "",
                });
            } catch (err) {
                console.error(err);
                setError("Failed to load trip");
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await api.put(`/trips/${id}`, {
                ...form,
                availableSeats: Number(form.availableSeats),
                price: form.price === "" ? null : Number(form.price),
            });

            navigate(`/trips/${id}`, { replace: true });
        } catch (err) {
            console.error(err);
            setError("Failed to update trip");
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: 40, color: "#6B6B7D" }}>
                Loading...
            </div>
        );
    }

    return (
        <TripForm
            title="Edit trip"
            form={form}
            setForm={setForm}
            error={error}
            onSubmit={handleSubmit}
            submitLabel="Save"
            onCancel={() => navigate(`/trips/${id}`)}
            cancelLabel="Cancel"
        />
    );
};

export default TripEditPage;