const { Sequelize } = require('sequelize');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // This creates the file in your server folder
    logging: false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ SQLite Database connected successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };