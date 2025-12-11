const express = require("express");
const axios = require("axios");
const { Trip } = require("../database");
const { verifyToken } = require("../utils/token.js");

const router = express.Router();
const GOOGLE_KEY = process.env.GOOGLE_KEY;

router.post("/geocode", verifyToken, async (req, res) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).json({
            success: false,
            message: "address is required"
        });
    }

    try {
        const geoRes = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
            )}&key=${GOOGLE_KEY}`
        );

        if (!geoRes.data.results.length) {
            return res.status(404).json({
                success: false,
                message: "Address could not be geocoded"
            });
        }

        const result = geoRes.data.results[0];
        const location = result.geometry.location; // { lat, lng }

        return res.json({
            success: true,
            lat: location.lat,
            lng: location.lng
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Geocoding failed"
        });
    }
});

router.post("/match", verifyToken, async (req, res) => {
    const {
        pickupAddress,
        destinationAddress,
        maxPickupDistance,
        maxDestinationDistance,
        maxDistance,
    } = req.body;

    if (!pickupAddress || !destinationAddress) {
        return res.status(400).json({
            success: false,
            message: "pickupAddress and destinationAddress are required",
        });
    }

    const pickupMax = Number(
        maxPickupDistance ?? maxDistance ?? 2000
    );
    const destMax = Number(
        maxDestinationDistance ?? maxDistance ?? 3000
    );

    try {
        const geoPickup = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                pickupAddress
            )}&key=${GOOGLE_KEY}`
        );
        if (!geoPickup.data.results.length) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Unable to geocode pickupAddress"
                });
        }
        const userPickupLoc = geoPickup.data.results[0].geometry.location;

        const geoDest = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                destinationAddress
            )}&key=${GOOGLE_KEY}`
        );
        if (!geoDest.data.results.length) {
            return res.status(400).json({
                success: false,
                message: "Unable to geocode destinationAddress",
            });
        }
        const userDestLoc = geoDest.data.results[0].geometry.location;

        const trips = await Trip.findAll();

        const matches = [];

        for (const trip of trips) {
            if (
                trip.originLat == null ||
                trip.originLng == null ||
                trip.destinationLat == null ||
                trip.destinationLng == null
            ) {
                continue;
            }

            const tripPickup = {
                lat: Number(trip.originLat),
                lng: Number(trip.originLng),
            };
            const tripDest = {
                lat: Number(trip.destinationLat),
                lng: Number(trip.destinationLng),
            };

            const pickupDirRes = await axios.get(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${userPickupLoc.lat},${userPickupLoc.lng}&destination=${tripPickup.lat},${tripPickup.lng}&key=${GOOGLE_KEY}`
            );
            if (!pickupDirRes.data.routes.length) continue;
            const pickupLeg = pickupDirRes.data.routes[0].legs[0];
            const pickupDistance = pickupLeg.distance.value;
            const pickupDuration = pickupLeg.duration.value;

            if (pickupDistance > pickupMax) {
                continue;
            }

            const destDirRes = await axios.get(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${userDestLoc.lat},${userDestLoc.lng}&destination=${tripDest.lat},${tripDest.lng}&key=${GOOGLE_KEY}`
            );
            if (!destDirRes.data.routes.length) continue;
            const destLeg = destDirRes.data.routes[0].legs[0];
            const destDistance = destLeg.distance.value;
            const destDuration = destLeg.duration.value;

            if (destDistance > destMax) {
                continue;
            }

            matches.push({
                tripId: trip.id,
                driverId: trip.driver_id,
                origin: trip.origin,
                destination: trip.destination,
                departureTime: trip.departureTime,
                availableSeats: trip.availableSeats,
                price: trip.price,
                pickupDistance_meters: pickupDistance,
                pickupDuration_seconds: pickupDuration,
                destinationDistance_meters: destDistance,
                destinationDuration_seconds: destDuration,
            });
        }
        matches.sort(
            (a, b) => a.pickupDistance_meters - b.pickupDistance_meters
        );

        return res.json({
            pickupAddress,
            destinationAddress,
            maxPickupDistance: pickupMax,
            maxDestinationDistance: destMax,
            count: matches.length,
            matches,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Match operation failed" });
    }
});

module.exports = router;