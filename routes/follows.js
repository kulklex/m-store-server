const express = require('express');
const router = express.Router();
const { followUser, unfollowUser, getMutualFollowing, getMutualFollowers } = require('../controllers/follows');
const { clerkVerifyToken } = require('../middlewares/verifyClerkToken');


router.post('/:targetUserId', clerkVerifyToken, followUser);
router.delete('/:targetUserId', clerkVerifyToken, unfollowUser);
router.get('/mutual-following/:userId1/:userId2', clerkVerifyToken, getMutualFollowing);
router.get('/mutual-followers/:userId1/:userId2', clerkVerifyToken, getMutualFollowers);

module.exports = router;
