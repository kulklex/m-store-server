const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Clerk ID
      required: true
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId, // References the Post by MongoDB _id
      ref: 'Post',
      required: true
    },
    content: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
