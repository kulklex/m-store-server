const express = require('express');
const { signIn, signUp, getUser } = require('../controllers/auth')
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router()


router.post('/sign-up', signUp);


router.post('/sign-in', signIn);

router.get('/me', verifyToken, getUser)

module.exports = router
