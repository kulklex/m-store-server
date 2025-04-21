const express = require('express');
const { signIn, signUp, getUser, getRefreshTokens, resetPassword, getUserByClerkID } = require('../controllers/auth')
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router()


router.post('/sign-up', signUp);

router.post('/sign-in', signIn);

router.post('/refresh-token', getRefreshTokens);

router.get('/me', verifyToken, getUser);

router.get('/clerkId', getUserByClerkID);

router.post('/reset-password', resetPassword);

module.exports = router
