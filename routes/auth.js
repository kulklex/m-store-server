const express = require('express');
const { signIn, signUp, getUser, getRefreshTokens, resetPassword, getUserByClerkID, syncGoogleLogin } = require('../controllers/auth')
const { verifyToken } = require('../middlewares/verifyToken');
const { clerkVerifyToken } = require('../middlewares/verifyClerkToken');

const router = express.Router()


router.post('/sign-up', signUp);

router.post('/sign-in', signIn);

router.post('/refresh-token', getRefreshTokens);

router.get('/me', verifyToken, getUser);

router.post('/reset-password', resetPassword);

router.get('/clerkId', getUserByClerkID);

// Called right after Google login from Expo
router.post('/sync', clerkVerifyToken, syncGoogleLogin)

module.exports = router
