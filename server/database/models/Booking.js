module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define(
        "Booking",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            trip_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            passenger_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            seats: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: "CONFIRMED",
            },
        },
        {
            tableName: "bookings",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    Booking.associate = (models) => {
        Booking.belongsTo(models.Trip, { foreignKey: "trip_id", as: "trip" });
        Booking.belongsTo(models.User, {
            foreignKey: "passenger_id",
            as: "passenger",
        });
    };

    return Booking;
};