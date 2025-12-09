const express = require("express");
const { Booking, Trip, User } = require("../database");
const {verifyToken} = require('../utils/token.js');

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
    try {
        const passengerId = req.user.id;
        const { tripId, seats } = req.body;

        if (!tripId || !seats || seats <= 0) {
            return res.status(400).json({
                success: false,
                message: "tripId and seats required",
                data: {},
            });
        }

        const trip = await Trip.findByPk(tripId);

        if (!trip) {
            return res
                .status(404)
                .json({ success: false, message: "Trip not found", data: {} });
        }

        if (trip.availableSeats < seats) {
            return res.status(400).json({
                success: false,
                message: "Not enough available seats",
                data: {},
            });
        }

        const booking = await Booking.create({
            trip_id: tripId,
            passenger_id: passengerId,
            seats,
            status: "CONFIRMED",
        });

        trip.availableSeats -= seats;
        await trip.save();

        res.status(201).json({
            success: true,
            message: "Booking created",
            data: booking,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating booking",
            data: error.message,
        });
    }
});

router.get("/", verifyToken, async (req, res) => {
    try {
        const passengerId = req.user.id;

        const bookings = await Booking.findAll({
            where: { passenger_id: passengerId },
            include: [
                {
                    model: Trip,
                    as: "trip",
                    include: [
                        {
                            model: User,
                            as: "driver",
                            attributes: ["id", "name", "email"],
                        },
                    ],
                },
            ],
        });

        res.status(200).json({
            success: true,
            message: "Bookings retrieved",
            data: bookings,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error retrieving bookings",
            data: error.message,
        });
    }
});

router.get("/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        const booking = await Booking.findByPk(id, {
            include: [
                {
                    model: Trip,
                    as: "trip",
                    include: [
                        {
                            model: User,
                            as: "driver",
                            attributes: ["id", "name", "email"],
                        },
                    ],
                },
                {
                    model: User,
                    as: "passenger",
                    attributes: ["id", "name", "email"],
                },
            ],
        });

        if (!booking) {
            return res
                .status(404)
                .json({ success: false, message: "Booking not found", data: {} });
        }

        if (booking.passenger_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only view your own bookings",
                data: {},
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking retrieved",
            data: booking,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error retrieving booking",
            data: error.message,
        });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        const booking = await Booking.findByPk(id);

        if (!booking) {
            return res
                .status(404)
                .json({ success: false, message: "Booking not found", data: {} });
        }

        if (booking.passenger_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can cancel only your own bookings",
                data: {},
            });
        }

        const trip = await Trip.findByPk(booking.trip_id);
        if (trip) {
            trip.availableSeats += booking.seats;
            await trip.save();
        }

        booking.status = "CANCELLED";
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled",
            data: {},
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error cancelling booking",
            data: error.message,
        });
    }
});

module.exports = router;