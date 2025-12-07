const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const db = require("./database");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({ message: "Hello from carpool API" });
});

db.sequelize
    .sync()
    .then(() => {
        console.log("DB synced");
        app.listen(PORT, () =>
            console.log(`Server running on http://localhost:${PORT}`)
        );
    })
    .catch((err) => {
        console.error("Error syncing DB:", err);
    });