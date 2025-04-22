const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
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
}, {
    timestamps: true
});

// Primary compound index (unique to prevent duplicate likes)
likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

// Reverse compound index for different query patterns
likeSchema.index({ postId: 1, userId: 1 });

// For showing likes in chronological order
likeSchema.index({ createdAt: -1 });

// For user's liked posts feed
likeSchema.index({ userId: 1, createdAt: -1 });

// For post like analytics
likeSchema.index({ postId: 1, createdAt: -1 });

const Likes = mongoose.model('Likes', likeSchema);
module.exports = Likes;