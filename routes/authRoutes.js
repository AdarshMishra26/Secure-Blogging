const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register',  authController.register);
router.get('/login',  authController.login);
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
