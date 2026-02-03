const express = require('express');
const cors = require('cors');
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

app.get('/', (req, res) => {
    res.send('BizHive SQL Backend is Running!');
});

// ⭐ SAFETY CHECK: Prevent the "Class constructor" crash
// This checks if the files are actually Routes before using them
if (typeof postRoutes !== 'function') {
    console.error("❌ CRITICAL ERROR: server/routes/posts.js is exporting the wrong thing!");
    console.error("--> Expected: A Router function");
    console.error("--> Received:", postRoutes);
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