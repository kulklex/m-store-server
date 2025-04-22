const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    caption: {
        type: String,
        index: true // For text search
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: String, // Clerk ID
        required: true,
        index: true
    },
    storageId: {
        type: String,
        index: true // For media management
    },
    likes: {
        type: Number,
        required: true,
        index: true // For popular posts queries
    },
    comments: {
        type: Number,
        required: true,
        index: true // For engagement analysis
    },
}, {
    timestamps: true
});

// Text search index (full-text search on captions)
PostSchema.index({ caption: 'text' });

// Compound indexes
PostSchema.index({ userId: 1, createdAt: -1 }); // User's posts in chronological order
PostSchema.index({ likes: -1, createdAt: -1 }); // Top posts by likes
PostSchema.index({ comments: -1, createdAt: -1 }); // Top posts by comments
PostSchema.index({ userId: 1, likes: -1 }); // User's most popular posts
PostSchema.index({ createdAt: -1 }); // Global recent posts feed

// For time-based analytics
PostSchema.index({ 
    createdAt: 1,
    likes: -1,
    comments: -1 
});

// For admin/moderation purposes
PostSchema.index({ 
    userId: 1,
    reported: 1 // Add when you implement reporting
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;