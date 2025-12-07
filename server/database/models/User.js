// server/database/models/User.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "users",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    User.associate = (models) => {
        User.hasMany(models.Trip, { foreignKey: "driver_id", as: "tripsAsDriver" });
        User.hasMany(models.Booking, {
            foreignKey: "passenger_id",
            as: "bookings",
        });
    };

    return User;
};