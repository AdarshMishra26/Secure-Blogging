const jwt = require('jsonwebtoken');

module.exports = {
    ensureAuthenticated: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'No token provided' });

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Token format is invalid' });

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err || !decoded.otpVerified) {
                return res.status(401).json({ error: 'Unauthorized access' });
            }

            req.user = { id: decoded.id };
            next();
        });
    }
};
