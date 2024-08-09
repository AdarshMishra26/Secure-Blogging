module.exports = {
    ensureAuthenticated: (req, res, next) => {
        const token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
            if (err || !decoded.otpVerified) {
                return res.status(401).json({ error: 'Unauthorized access' });
            }

            req.user = { id: decoded.id };
            next();
        });
    }
};
