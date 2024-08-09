const db = require('../config/db');

const User = {
    create: (user, callback) => {
        const sql = 'INSERT INTO users (username, email, password, secret, otp_enabled) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [user.username, user.email, user.password, user.secret, user.otp_enabled], callback);
    },
    findByUsername: (username, callback) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [username], callback);
    },
    findById: (id, callback) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = User;
