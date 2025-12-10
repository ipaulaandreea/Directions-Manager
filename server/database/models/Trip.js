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
            originLat: {
                type: DataTypes.DECIMAL(10, 7),
                allowNull: true,
            },
            originLng: {
                type: DataTypes.DECIMAL(10, 7),
                allowNull: true,
            },
            destination: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            destinationLat: {
                type: DataTypes.DECIMAL(10, 7),
                allowNull: true,
            },
            destinationLng: {
                type: DataTypes.DECIMAL(10, 7),
                allowNull: true,
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