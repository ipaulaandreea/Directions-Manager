const express = require("express");
const { Op } = require("sequelize");
const { Trip, User, Booking } = require("../database");
const {verifyToken} = require('../utils/token.js');
const axios = require("axios");

const router = express.Router();
const GOOGLE_KEY = process.env.GOOGLE_KEY;

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
    const {
        origin,
        destination,
        departureTime,
        availableSeats,
        price,
    } = req.body;

    if (!origin || !destination || !departureTime || !availableSeats) {
        return res.status(400).json({
            success: false,
            message: "origin, destination, departureTime și availableSeats sunt obligatorii",
        });
    }

    try {
        const geoOrigin = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                origin
            )}&key=${GOOGLE_KEY}`
        );
        if (!geoOrigin.data.results.length) {
            return res
                .status(400)
                .json({ success: false, message: "Nu s-a putut geocoda origin" });
        }
        const originLoc = geoOrigin.data.results[0].geometry.location;

        const geoDest = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                destination
            )}&key=${GOOGLE_KEY}`
        );
        if (!geoDest.data.results.length) {
            return res
                .status(400)
                .json({ success: false, message: "Nu s-a putut geocoda destination" });
        }
        const destLoc = geoDest.data.results[0].geometry.location;

        const trip = await Trip.create({
            driver_id: req.user.id,
            origin,
            originLat: Number(originLoc.lat.toFixed(6)),
            originLng: Number(originLoc.lng.toFixed(6)),
            destination,
            destinationLat: Number(destLoc.lat.toFixed(6)),
            destinationLng: Number(destLoc.lng.toFixed(6)),
            departureTime,
            availableSeats,
            price,
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
            return res.status(403).json({
                success: false,
                message: "You can only update your own trips",
            });
        }

        const {
            origin,
            destination,
            departureTime,
            availableSeats,
            price,
        } = req.body;

        let originLat = trip.originLat;
        let originLng = trip.originLng;
        let destinationLat = trip.destinationLat;
        let destinationLng = trip.destinationLng;

        if (origin && origin !== trip.origin) {
            const geoOrigin = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    origin
                )}&key=${GOOGLE_KEY}`
            );
            if (!geoOrigin.data.results.length) {
                return res
                    .status(400)
                    .json({ success: false, message: "Nu s-a putut geocoda origin" });
            }
            const loc = geoOrigin.data.results[0].geometry.location;
            originLat = loc.lat;
            originLng = loc.lng;
        }

        if (destination && destination !== trip.destination) {
            const geoDest = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    destination
                )}&key=${GOOGLE_KEY}`
            );
            if (!geoDest.data.results.length) {
                return res.status(400).json({
                    success: false,
                    message: "Nu s-a putut geocoda destination",
                });
            }
            const loc = geoDest.data.results[0].geometry.location;
            destinationLat = loc.lat;
            destinationLng = loc.lng;
        }

        const updatedTrip = await trip.update({
            origin: origin ?? trip.origin,
            originLat,
            originLng,
            destination: destination ?? trip.destination,
            destinationLat,
            destinationLng,
            departureTime: departureTime ?? trip.departureTime,
            availableSeats: availableSeats ?? trip.availableSeats,
            price: price ?? trip.price,
        });

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