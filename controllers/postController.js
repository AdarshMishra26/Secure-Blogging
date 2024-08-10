const Post = require('../models/postModel');

const PostController = {
    createPost: async (req, res) => {
        try {
            const newPost = {
                user_id: req.user.id,
                title: req.body.title,
                content: req.body.content
            };

            await Post.create(newPost);
            res.status(201).json({ message: 'Post created successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updatePost: async (req, res) => {
        try {
            const updatedPost = {
                title: req.body.title,
                content: req.body.content
            };

            await Post.update(req.params.id, updatedPost);
            res.status(200).json({ message: 'Post updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deletePost: async (req, res) => {
        try {
            await Post.delete(req.params.id);
            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAllPosts: async (req, res) => {
        try {
            const results = await Post.findAll();
            res.status(200).json(results);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    searchPosts: async (req, res) => {
        try {
            const query = req.query.q;
            const results = await Post.search(query);
            res.status(200).json(results);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = PostController;
