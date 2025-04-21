const express = require('express');
const { createComment, fetchComments, deleteComment } = require('../controllers/comment');
const { clerkVerifyToken } = require('../middlewares/verifyClerkToken');
const router = express.Router();

router.get('/:postId', fetchComments)
router.post('/', clerkVerifyToken, createComment);
router.delete('/:commentId', clerkVerifyToken, deleteComment);



module.exports = router;
