const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const csrfMiddleware = require('../middleware/csrfMiddleware');

router.post('/',  authMiddlewae.ensureAuthenticated, postController.createPost);
router.put('/:id', authMiddleware.ensureAuthenticated, postController.updatePost);
router.delete('/:id', authMiddleware.ensureAuthenticated, postController.deletePost);
router.get('/',  postController.getAllPosts);
router.get('/search',  postController.searchPosts);

module.exports = router;
