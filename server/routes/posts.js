const express = require('express');
const multer = require('multer'); // ⭐ Import Multer
const path = require('path');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

// ⭐ CONFIGURE STORAGE ENGINE
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Create a unique name: "timestamp-originalName.jpg"
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Filter to only accept images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


// 1. GET ALL POSTS
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, attributes: ['username', 'karma'] },
                { model: User, as: 'Likers', attributes: ['id'] }
            ]
        });
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: error.message });
    }
});

// 2. CREATE POST (Now accepts 'image' file)
// ⭐ Notice 'upload.single("image")' - this tells Multer to look for one file
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, content, category, userId } = req.body;
        
        // Check if an image was uploaded
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !content || !category || !userId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newPost = await Post.create({ 
            title, 
            content, 
            category, 
            UserId: userId,
            imageUrl // Save the path to database
        });
        
        // Add Karma
        const user = await User.findByPk(userId);
        if (user) { 
            user.karma += 10; 
            await user.save(); 
        }

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
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
        console.error("Like Error:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;