const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // ⭐ NEW: Karma Points System
    karma: {
        type: DataTypes.INTEGER,
        defaultValue: 5 // Bonus: Everyone starts with 5 points just for joining!
    }
});

module.exports = User;