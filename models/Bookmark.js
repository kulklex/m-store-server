const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Clerk ID
      required: true,
      index: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true }); // Prevents duplicate bookmarks
bookmarkSchema.index({ postId: 1, userId: 1 }); // Reverse order for different query patterns
bookmarkSchema.index({ userId: 1, createdAt: -1 }); // For showing user's bookmarks in chronological order
bookmarkSchema.index({ postId: 1, createdAt: -1 }); // For showing bookmarks per post (analytics)

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;