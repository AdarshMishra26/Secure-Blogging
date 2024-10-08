const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',  authMiddleware.ensureAuthenticated, postController.createPost);
router.put('/:id', authMiddleware.ensureAuthenticated, postController.updatePost);
router.delete('/:id', authMiddleware.ensureAuthenticated, postController.deletePost);
router.get('/',  postController.getAllPosts);
router.get('/search',  postController.searchPosts);

module.exports = router;
