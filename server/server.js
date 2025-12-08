const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const express = require("express");
const db = require("./database");
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(morgan('dev'))
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.json({ message: "Hello from carpool API" });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

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