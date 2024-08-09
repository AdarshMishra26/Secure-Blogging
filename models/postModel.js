const db = require('../config/db');

const Post = {
    create: (post, callback) => {
        const sql = 'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)';
        db.query(sql, [post.user_id, post.title, post.content], callback);
    },
    update: (id, post, callback) => {
        const sql = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
        db.query(sql, [post.title, post.content, id], callback);
    },
    delete: (id, callback) => {
        const sql = 'DELETE FROM posts WHERE id = ?';
        db.query(sql, [id], callback);
    },
    findAll: (callback) => {
        const sql = 'SELECT * FROM posts';
        db.query(sql, callback);
    },
    search: (query, callback) => {
        const sql = 'SELECT * FROM posts WHERE title LIKE ? OR content LIKE ?';
        db.query(sql, [`%${query}%`, `%${query}%`], callback);
    }
};

module.exports = Post;
