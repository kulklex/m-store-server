const express = require('express');
const { likePost, unlikePost, getLikesByPost, getUserLikes } = require('../controllers/likes');
const router = express.Router();
const { clerkVerifyToken } = require('../middlewares/verifyClerkToken');


router.post('/', clerkVerifyToken, likePost);
router.get('/user/:clerkId', clerkVerifyToken, getUserLikes);
router.get('/:postId', clerkVerifyToken, getLikesByPost);
router.delete('/', clerkVerifyToken, unlikePost);


module.exports = router;