const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const csrfMiddleware = require('../middleware/csrfMiddleware');

router.post('/register', csrfMiddleware, authController.register);
router.post('/login', csrfMiddleware, authController.login);
router.post('/verify-otp', csrfMiddleware, authController.verifyOtp);

module.exports = router;
