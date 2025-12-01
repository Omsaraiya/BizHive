const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');
const Post = require('./models/Post'); // We import this so Sequelize knows to create the table
const postRoutes = require('./routes/posts');

const app = express();
const PORT = 5000;

// Middleware (Allows the frontend to talk to the backend)
app.use(cors());
app.use(express.json());

// A simple test route to check if server is alive
app.get('/', (req, res) => {
    res.send('BizHive SQL Backend is Running!');
});

// Routes
app.use('/api/posts', postRoutes);

// START THE SERVER
const startServer = async () => {
    try {
        // 1. Connect to Database
        await connectDB();
        
        // 2. Sync Database (Magic Step: Creates tables if they don't exist)
        // { force: false } means "Don't delete data if the table already exists"
        await sequelize.sync({ force: false }); 
        console.log('✅ SQLite Database & Tables are ready!');

        // 3. Start Listening
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
    }
};

startServer();