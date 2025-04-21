const Post = require('../models/Post');
const User = require('../models/User');


// CREATE POST
const createPost = async (req, res) => {
    try {
        const { caption, imageUrl, clerkId } = req.body; // Expecting clerkId from request body

        if (!clerkId || !imageUrl) {
            return res.status(400).json({ error: 'Clerk ID and Image URL are required' });
        }

        // Find the user by clerkId
        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create new post with clerkId as userId
        const newPost = new Post({
            caption,
            imageUrl,
            userId: user.clerkId, 
            likes: 0,
            comments: 0,
        });

        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

// GET ALL POSTS (With User Data)
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        // Manually fetch user details using clerkId
        const postsWithUser = await Promise.all(posts.map(async (post) => {
            const user = await User.findOne({ clerkId: post.userId }).select('firstName lastName email image');
            return { ...post._doc, user };
        }));

        res.status(200).json(postsWithUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

// GET A SINGLE POST (With User Data)
const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const user = await User.findOne({ clerkId: post.userId }).select('firstName lastName email image');
        res.status(200).json({ ...post._doc, user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};

// UPDATE POST
const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { caption, imageUrl } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { caption, imageUrl },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
};

// DELETE POST
const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
};
