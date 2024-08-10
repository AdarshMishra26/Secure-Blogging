const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// const csrfMiddleware = require('../middleware/csrfMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
