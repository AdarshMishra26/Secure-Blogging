const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helmet = require('helmet');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// CSRF Protection
app.use(csrf({ cookie: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
