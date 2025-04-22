const express = require('express');
const { createBookmark, fetchBookmarks, deleteBookmark } = require('../controllers/bookmark');
const { clerkVerifyToken } = require('../middlewares/verifyClerkToken');
const router = express.Router();

router.post('/', clerkVerifyToken, createBookmark)
router.get('/', clerkVerifyToken, fetchBookmarks)
router.delete('/:postId', clerkVerifyToken, deleteBookmark)


module.exports = router;
