const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const { Sequelize, DataTypes } = require("sequelize");

const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

const sequelize = new Sequelize(DB_NAME, DB_USER, String(DB_PASSWORD), {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
});

const User = require("./models/User")(sequelize, DataTypes);
const Trip = require("./models/Trip")(sequelize, DataTypes);
const Booking = require("./models/Booking")(sequelize, DataTypes);

const db = {
    sequelize,
    Sequelize,
    User,
    Trip,
    Booking,
};

Object.keys(db).forEach((modelName) => {
    const model = db[modelName];
    if (model && model.associate) {
        model.associate(db);
    }
});

module.exports = db;