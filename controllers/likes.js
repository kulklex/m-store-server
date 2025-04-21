const Like = require('../models/Likes');
const Post = require('../models/Post');

// Like a post
const likePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    // Prevent duplicate likes
    const existing = await Like.findOne({ userId, postId });
    if (existing) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    const like = new Like({ userId, postId });
    await like.save();

    // Optionally update like count on post
    await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });

    res.status(201).json({ message: 'Post liked', like });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Unlike a post
const unlikePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const deleted = await Like.findOneAndDelete({ userId, postId });
    if (!deleted) {
      return res.status(404).json({ message: 'Like not found' });
    }

    // Optionally update like count
    await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });

    res.status(200).json({ message: 'Post unliked' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Get like count on a post
const getLikesByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const count = await Like.countDocuments({ postId });
    res.status(200).json({ postId, likeCount: count });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Get all liked posts by a user
const getUserLikes = async (req, res) => {
  try {
    const { userId } = req.params;
    const likes = await Like.find({ userId }).populate('postId');
    res.status(200).json({ likes });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = {
  likePost,
  unlikePost,
  getLikesByPost,
  getUserLikes,
};
