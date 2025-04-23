const express = require('express');
const router = express.Router();
const { getPosts, createPost, getPostById, updatePost, updatePostImage, deletePost } = require('../controllers/posts');
const { clerkVerifyToken } = require('../middlewares/verifyClerkToken');



router.post('/', clerkVerifyToken, createPost);
router.get('/', clerkVerifyToken, getPosts);
router.get('/:id', clerkVerifyToken, getPostById);
router.patch('/:id', clerkVerifyToken, updatePost);
router.patch('/posts/:id/image', clerkVerifyToken, updatePostImage)
router.delete('/:id', clerkVerifyToken, deletePost);



module.exports = router;
