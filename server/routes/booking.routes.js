const express = require("express");
const { Booking, Trip, User } = require("../database");
const {verifyToken} = require('../utils/token.js');
const db = require('../database');

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
        const bookings = await Booking.findAll({
            where: { passenger_id: req.user.id },
            include: [
                {
                    model: Trip,
                    as: "trip",
                    attributes: ["origin", "destination", "departureTime", "price"]
                }
            ]
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

router.patch("/:id/cancel", verifyToken, async (req, res) => {
    const bookingId = req.params.id;

    const t = await db.sequelize.transaction();
    try {
        const booking = await Booking.findByPk(bookingId, { transaction: t });
        if (!booking) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        if (booking.passenger_id !== req.user.id) {
            await t.rollback();
            return res.status(403).json({ success: false, message: "Not allowed" });
        }

        if (booking.status === "CANCELLED") {
            await t.rollback();
            return res.json({ success: true, message: "Already cancelled" });
        }

        const trip = await Trip.findByPk(booking.trip_id, { transaction: t });
        if (!trip) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Trip not found" });
        }

        booking.status = "CANCELLED";
        await booking.save({ transaction: t });

        trip.availableSeats = Number(trip.availableSeats) + Number(booking.seats);
        await trip.save({ transaction: t });

        await t.commit();
        return res.json({ success: true, message: "Cancelled", availableSeats: trip.availableSeats });
    } catch (e) {
        await t.rollback();
        console.error(e);
        return res.status(500).json({ success: false, message: "Cancel failed" });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    const bookingId = req.params.id;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.passenger_id !== req.user.id) {
        return res.status(403).json({ success: false, message: "Not allowed" });
    }

    await booking.destroy();

    return res.json({ success: true, message: "Booking deleted" });
});

module.exports = router;