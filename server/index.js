const express = require('express');
const cors = require('cors');
const path = require('path'); // ⭐ NEW: Tool for handling file paths
const { connectDB, sequelize } = require('./config/database');

// Import Models
const Post = require('./models/Post'); 
const User = require('./models/User'); 

// Import Routes
const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth'); 
const userRoutes = require('./routes/users'); 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ⭐ NEW: Make the 'uploads' folder public so the frontend can display images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('BizHive SQL Backend is Running!');
});

// Use Routes
// Safety Check
if (typeof postRoutes !== 'function') {
    console.error("❌ CRITICAL ERROR: server/routes/posts.js is exporting the wrong thing!");
} else {
    app.use('/api/posts', postRoutes);
}

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes); 

const startServer = async () => {
    try {
        await connectDB();

        // Relationships
        User.hasMany(Post);
        Post.belongsTo(User);
        User.belongsToMany(Post, { through: 'Likes' });
        Post.belongsToMany(User, { through: 'Likes', as: 'Likers' });

        // ⭐ IMPORTANT: We changed the model, so we must update the table
        await sequelize.sync({ alter: true });
        console.log('✅ SQLite Database & Tables are ready!');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
    }
};

startServer();