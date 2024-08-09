const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./config/db');

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

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to render the register form with CSRF token
app.get('/register', (req, res) => {
    res.render('register', { csrfToken: req.csrfToken() });
});

// Logging
app.use(morgan('dev'));

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));

// Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
