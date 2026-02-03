const express = require('express');
const User = require('../models/User');

const router = express.Router();

// GET ALL USERS (For the Leaderboard)
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['username', 'karma'], // Only get name and score
            order: [['karma', 'DESC']],       // Highest score first
            limit: 10                         // Top 10 only
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;