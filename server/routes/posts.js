const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment'); // ⭐ Import Comment Model

const router = express.Router();

// CONFIG: Image Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Not an image!'), false);
};
const upload = multer({ storage, fileFilter });

// 1. GET ALL POSTS (Now includes Comments!)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, attributes: ['username', 'karma'] },
                { model: User, as: 'Likers', attributes: ['id'] },
                // ⭐ NEW: Include Comments and their Authors
                { 
                    model: Comment, 
                    include: [{ model: User, attributes: ['username'] }] 
                }
            ]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. CREATE POST
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, content, category, userId } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !content || !category || !userId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newPost = await Post.create({ title, content, category, UserId: userId, imageUrl });
        
        const user = await User.findByPk(userId);
        if (user) { user.karma += 10; await user.save(); }

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. TOGGLE LIKE
router.put('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const hasLiked = await post.hasLiker(userId);
        if (hasLiked) {
            await post.removeLiker(userId);
            res.json({ status: 'unliked' });
        } else {
            await post.addLiker(userId);
            res.json({ status: 'liked' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. ⭐ NEW: CREATE COMMENT
router.post('/:id/comments', async (req, res) => {
    try {
        const { userId, content } = req.body;
        const postId = req.params.id;

        if (!content || !userId) return res.status(400).json({ message: 'Content required' });

        const newComment = await Comment.create({
            content,
            UserId: userId,
            PostId: postId
        });

        // Add small karma for commenting? Optional!
        const user = await User.findByPk(userId);
        if (user) { user.karma += 2; await user.save(); }

        // Fetch the full comment with User data to send back to frontend
        const fullComment = await Comment.findByPk(newComment.id, {
            include: [{ model: User, attributes: ['username'] }]
        });

        res.status(201).json(fullComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;