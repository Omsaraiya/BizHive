const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.ENUM('growth', 'showcase'), allowNull: false, defaultValue: 'growth' },
    upvotes: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Post;