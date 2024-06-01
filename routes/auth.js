const express = require('express');
const { signIn, signUp, getUser, getRefreshTokens } = require('../controllers/auth')
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router()


router.post('/sign-up', signUp);

router.post('/sign-in', signIn);

router.post('/refresh-token', getRefreshTokens);

router.get('/me', verifyToken, getUser);

module.exports = router
