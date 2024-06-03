const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');


const generateSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

const accessTokenSecret = generateSecret();
const refreshTokenSecret = generateSecret();
const refreshTokens = [];

// Generate tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign({ email: user.email, id: user._id }, accessTokenSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ email: user.email, id: user._id }, refreshTokenSecret, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};


// Sign Up Controller
const signUp = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists!" });

        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match!" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, firstName, lastName });
        const { accessToken, refreshToken } = generateTokens(result);
        refreshTokens.push(refreshToken);

        res.status(200).json({ result, accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: "Couldn't process the signUp....", error });
    }
};


// Sign In Controller
const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: "Invalid email or password" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid email or password" });

        const { accessToken, refreshToken } = generateTokens(existingUser);
        refreshTokens.push(refreshToken);

        res.status(200).json({ result: existingUser, accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: "Couldn't process the signIn....", error });
    }
};



// Fetch user details
const getUser = async (req, res) => {
    const userId = req.user.id
    
    try {
        const user = await User.findById(userId).select('-password'); // Exclude password field
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


// Refresh token controller
const getRefreshTokens = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);
  
    if (!refreshTokens.includes(token)) return res.sendStatus(403);
  
    jwt.verify(token, refreshTokenSecret, (err, user) => {
      if (err) return res.sendStatus(403);
  
      const newAccessToken = jwt.sign({ email: user.email, id: user.id }, accessTokenSecret, { expiresIn: '15m' });
      res.json({ accessToken: newAccessToken });
    });
}


// Reset Password Controller
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Could not reset password', error });
    }
};

module.exports = { signUp, signIn, refreshTokens, getUser, getRefreshTokens, accessTokenSecret, refreshTokenSecret, refreshTokens, resetPassword };
