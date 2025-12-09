const express = require("express");
const { Op } = require("sequelize");
const { Trip, User, Booking } = require("../database");
const {verifyToken} = require('../utils/token.js');

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const trips = await Trip.findAll({
            include: [{ model: User, as: "driver", attributes: ["id", "name", "email"] }]
        });
        res.status(200).json({ success: true, data: trips });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/search", async (req, res) => {
    const { origin, destination, date } = req.query;

    try {
        const where = {};
        if (origin) where.origin = origin;
        if (destination) where.destination = destination;
        if (date)
            where.departureTime = {
                [Op.gte]: new Date(date),
                [Op.lt]: new Date(new Date(date).getTime() + 86400000)
            };

        const trips = await Trip.findAll({
            where,
            include: [{ model: User, as: "driver", attributes: ["id", "name", "email"] }]
        });

        res.status(200).json({ success: true, data: trips });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const trip = await Trip.findByPk(req.params.id, {
            include: [
                { model: User, as: "driver", attributes: ["id", "name", "email"] },
                { model: Booking, as: "bookings", attributes: ["id", "passenger_id", "seats", "status"] }
            ]
        });

        if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

        res.status(200).json({ success: true, data: trip });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post("/", verifyToken, async (req, res) => {
    try {
        const trip = await Trip.create({
            driver_id: req.user.id,
            ...req.body
        });

        res.status(201).json({ success: true, data: trip });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put("/:id", verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findByPk(req.params.id);

        if (!trip) {
            return res.status(404).json({ success: false, message: "Trip not found" });
        }

        if (trip.driver_id !== req.user.id) {
            return res.status(403).json({ success: false, message: "You can only update your own trips" });
        }

        const updatedTrip = await trip.update(req.body);

        res.status(200).json({ success: true, data: updatedTrip });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findByPk(req.params.id);

        if (!trip) {
            return res.status(404).json({ success: false, message: "Trip not found" });
        }

        if (trip.driver_id !== req.user.id) {
            return res.status(403).json({ success: false, message: "You can delete only your own trips" });
        }

        await trip.destroy();

        res.status(200).json({ success: true, message: "Trip deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;