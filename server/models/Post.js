const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'general'
    },
    imageUrl: {  // ⭐ NEW: This column stores the link to the image
        type: DataTypes.STRING,
        allowNull: true // Images are optional
    }
});

module.exports = Post;