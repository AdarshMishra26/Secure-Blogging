const Post = require('../models/postModel');

const PostController = {
    createPost: (req, res) => {
        const newPost = {
            user_id: req.user.id,
            title: req.body.title,
            content: req.body.content
        };

        Post.create(newPost, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Post created successfully' });
        });
    },

    updatePost: (req, res) => {
        const updatedPost = {
            title: req.body.title,
            content: req.body.content
        };

        Post.update(req.params.id, updatedPost, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Post updated successfully' });
        });
    },

    deletePost: (req, res) => {
        Post.delete(req.params.id, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Post deleted successfully' });
        });
    },

    getAllPosts: (req, res) => {
        Post.findAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(results);
        });
    },

    searchPosts: (req, res) => {
        const query = req.query.q;
        Post.search(query, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(results);
        });
    }
};

module.exports = PostController;
