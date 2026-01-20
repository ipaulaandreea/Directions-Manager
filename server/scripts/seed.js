const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const db = require("../database");
const {hash} = require("bcrypt");

async function seed() {
    try {
        await db.sequelize.sync({ force: true });

        const hashed1 = await hash("password1", 10);
        const hashed2 = await hash("password2", 10);
        const hashed3 = await hash("password3", 10);

        const users = await Promise.all([
            db.User.create({
                name: "Paula",
                email: "paula@example.com",
                password: hashed1,
            }),
            db.User.create({
                name: "Andrei",
                email: "andrei@example.com",
                password: hashed2,
            }),
            db.User.create({
                name: "Maria",
                email: "maria@example.com",
                password: hashed3,
            }),
        ]);

        const [paula, andrei, maria] = users;

        const trips = await Promise.all([
            db.Trip.create({
                driver_id: paula.id,
                origin: "Bulevardul Unirii 1, București",
                originLat: 44.427693,
                originLng: 26.093133,
                destination: "Piața Universității, București",
                destinationLat: 44.434799,
                destinationLng: 26.101193,
                departureTime: new Date("2025-01-10T08:00:00"),
                availableSeats: 3,
                price: 120,
            }),

            db.Trip.create({
                driver_id: andrei.id,
                origin: "Piața Victoriei, București",
                originLat: 44.452695,
                originLng: 26.085333,
                destination: "Piața Romană, București",
                destinationLat: 44.445838,
                destinationLng: 26.097278,
                departureTime: new Date("2025-01-11T09:30:00"),
                availableSeats: 2,
                price: 60,
            }),

            db.Trip.create({
                driver_id: maria.id,
                origin: "Strada Mihai Eminescu 25, București",
                originLat: 44.447240,
                originLng: 26.100308,
                destination: "Piața Romană, București",
                destinationLat: 44.445838,
                destinationLng: 26.097278,
                departureTime: new Date("2025-01-12T07:45:00"),
                availableSeats: 4,
                price: 50,
            }),
        ]);

        const [trip1, trip2, trip3] = trips;

    } catch (err) {
        console.error("Error while seeding:", err);
    } finally {
        await db.sequelize.close();
    }
}

seed();