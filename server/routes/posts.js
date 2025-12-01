const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Import your SQL Model

// @route   GET /api/posts
// @desc    Get all posts (newest first)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']] // Sort by newest
        });
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', async (req, res) => {
    try {
        const { author, content, type } = req.body;

        // Validation: Don't allow empty posts
        if (!content || !author) {
            return res.status(400).json({ message: 'Content and Author are required' });
        }

        // Create the post in the SQLite database
        const newPost = await Post.create({
            author,
            content,
            type: type || 'advice'
        });

        res.json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;