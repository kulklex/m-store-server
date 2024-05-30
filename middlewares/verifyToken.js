const jwt = require('jsonwebtoken');
const { secret } = require('../controllers/auth');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']; 

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Remove 'Bearer ' if it's included in the token
    const actualToken = token.startsWith('Bearer ') ? token.slice(7, token.length).trimLeft() : token;

    jwt.verify(actualToken, secret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            } else {
                return res.status(500).json({ message: 'Failed to authenticate token' });
            }
        }

        req.user = decoded;
        next();
    });
};

module.exports = { verifyToken };
