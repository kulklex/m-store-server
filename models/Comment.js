const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Clerk ID
      required: true,
      index: true // Single field index
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true // Single field index
    },
    content: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

// Compound indexes
CommentSchema.index({ postId: 1, createdAt: -1 }); // Show latest comments on a post
CommentSchema.index({ userId: 1, createdAt: -1 }); // Show user's comment history
CommentSchema.index({ postId: 1, userId: 1 }); // Check if user commented on post
CommentSchema.index({ content: 'text' }); // Full-text search on comments

// For comment counting/analytics, basically optimizes countDocuments({ postId })
CommentSchema.index({ postId: 1, _id: 1 });

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;