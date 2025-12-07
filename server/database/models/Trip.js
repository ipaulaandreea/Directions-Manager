// server/database/models/Trip.js
module.exports = (sequelize, DataTypes) => {
    const Trip = sequelize.define(
        "Trip",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            driver_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            origin: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            destination: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            departureTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            availableSeats: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            price: DataTypes.DECIMAL,
            polyline: DataTypes.TEXT,
            maxDetourKm: DataTypes.DECIMAL,
        },
        {
            tableName: "trips",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    Trip.associate = (models) => {
        Trip.belongsTo(models.User, { foreignKey: "driver_id", as: "driver" });
        Trip.hasMany(models.Booking, { foreignKey: "trip_id", as: "bookings" });
    };

    return Trip;
};