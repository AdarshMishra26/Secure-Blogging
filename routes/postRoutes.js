const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const csrfMiddleware = require('../middleware/csrfMiddleware');

router.post('/', csrfMiddleware, authMiddleware.ensureAuthenticated, postController.createPost);
router.put('/:id', csrfMiddleware, authMiddleware.ensureAuthenticated, postController.updatePost);
router.delete('/:id', csrfMiddleware, authMiddleware.ensureAuthenticated, postController.deletePost);
router.get('/', csrfMiddleware, postController.getAllPosts);
router.get('/search', csrfMiddleware, postController.searchPosts);

module.exports = router;
