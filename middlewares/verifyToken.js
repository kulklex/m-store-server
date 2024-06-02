const jwt = require('jsonwebtoken');
const { accessTokenSecret, refreshTokenSecret, refreshTokens } = require('../controllers/auth');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = req.headers['x-refresh-token'];

    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length).trimLeft() : authHeader;

    try {
        const decoded = jwt.verify(token, accessTokenSecret);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            // Access token has expired, attempt to refresh
            if (!refreshToken) {
                return res.status(403).json({ message: 'No refresh token provided' });
            }

            if (!refreshTokens.includes(refreshToken)) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
                if (err) {
                    return res.status(403).json({ message: 'Failed to authenticate refresh token' });
                }
                
                const newAccessToken = jwt.sign({ email: user.email, id: user.id }, accessTokenSecret, { expiresIn: '1h' });
                res.setHeader('x-access-token', newAccessToken);

                const decoded = jwt.verify(newAccessToken, accessTokenSecret);
                req.user = decoded;
                next();
            });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
    }
};

module.exports = { verifyToken };
