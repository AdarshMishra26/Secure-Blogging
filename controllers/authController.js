const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const AuthController = {
    register: (req, res) => {
        const { username, email, password } = req.body;

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) throw err;

            const secret = speakeasy.generateSecret({ length: 20 }).base32;

            const newUser = {
                username,
                email,
                password: hash,
                secret,
                otp_enabled: false
            };

            User.create(newUser, (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    },

    login: (req, res) => {
        const { username, password } = req.body;

        User.findByUsername(username, (err, results) => {
            if (err || results.length === 0) {
                return res.status(400).json({ error: 'Invalid username or password' });
            }

            const user = results[0];

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(400).json({ error: 'Invalid username or password' });
                }
                if (user.otp_enabled) {
                    console.log('User ${user.username}')
                    const otp = speakeasy.totp({
                        secret: user.secret,
                        encoding: 'base32'
                    });

                    const mailOptions = {
                        from: '"Movie Blog" <noreply@movieblog.com>',
                        to: user.email,
                        subject: 'Your OTP Code',
                        text: `Your OTP code is: ${otp}`
                    };

                    transporter.sendMail(mailOptions, (err) => {
                        if (err) return res.status(500).json({ error: err.message });

                        const token = jwt.sign({ id: user.id, otpVerified: false }, process.env.SESSION_SECRET, { expiresIn: '10m' });
                        res.json({ message: 'OTP sent to your email', token });
                    });
                } else {
                    req.login(user, (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: 'Logged in successfully' });
                    });
                }
            });
        });
    },

    verifyOtp: (req, res) => {
        const { otp } = req.body;
        const token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
            if (err) return res.status(400).json({ error: 'Invalid token' });

            User.findById(decoded.id, (err, results) => {
                if (err || results.length === 0) {
                    return res.status(400).json({ error: 'User not found' });
                }

                const user = results[0];

                const verified = speakeasy.totp.verify({
                    secret: user.secret,
                    encoding: 'base32',
                    token: otp
                });

                if (verified) {
                    const token = jwt.sign({ id: user.id, otpVerified: true }, process.env.SESSION_SECRET, { expiresIn: '1h' });
                    res.json({ message: 'OTP verified', token });
                } else {
                    res.status(400).json({ error: 'Invalid OTP' });
                }
            });
        });
    }
};

module.exports = AuthController;
