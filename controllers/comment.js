const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Create comment
const createComment = async (req, res) => {
  try {
    const { clerkId, postId, content } = req.body;

    if (!clerkId || !postId || !content) {
      return res.status(400).json({ error: 'clerkId, postId, and content are required' });
    }

    // Verifying if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = new Comment({
      userId: user.clerkId, // Store clerkId directly
      postId: post._id,     // Store reference to Post
      content,
    });

    await newComment.save();

    res.status(201).json({ message: 'Comment created', comment: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get all comments
const fetchComments = async (req, res) => {
    try {
      const { postId } = req.params;
  
      const comments = await Comment.find({ postId })
        .sort({ createdAt: -1 });
  
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get comments' });
    }
  };
  

// Delete your comment
const deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { clerkId } = req.body; // You can also use req.user.clerkId if using auth middleware
  
      // Find the comment by ID
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
  
      // Ensure the user owns the comment
      if (comment.userId !== clerkId) {
        return res.status(403).json({ error: 'Unauthorized to delete this comment' });
      }
  
      await Comment.findByIdAndDelete(commentId);
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error while deleting comment' });
    }
  };

module.exports = { createComment, fetchComments, deleteComment }