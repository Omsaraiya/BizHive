const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
    author: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.ENUM('advice', 'promotion'), defaultValue: 'advice' },
    upvotes: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Post;