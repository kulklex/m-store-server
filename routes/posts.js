const express = require('express');const router = express.Router();
const { getPosts, createPost, getPostById, updatePost, deletePost } = require('../controllers/posts');
const { clerkVerifyToken } = require('../middlewares/verifyClerkToken');



router.post('/', clerkVerifyToken, createPost);
router.get('/', clerkVerifyToken, getPosts);
router.get('/:id', clerkVerifyToken, getPostById);
router.put('/:id', clerkVerifyToken, updatePost);
router.delete('/:id', clerkVerifyToken, deletePost);



module.exports = router;
