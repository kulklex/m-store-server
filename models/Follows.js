const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  }, 
  { timestamps: true }
);

// Indexes for efficient follower/following operations
FollowSchema.index({ userId: 1 }); // Quickly find a user's follow document
FollowSchema.index({ "followers": 1 }); // Find all documents where a user is a follower
FollowSchema.index({ "following": 1 }); // Find all documents where a user is being followed

// Compound indexes for queries
FollowSchema.index({ userId: 1, "followers": 1 }); // Check if a specific user follows another
FollowSchema.index({ userId: 1, "following": 1 }); // Check if a user follows someone specific
FollowSchema.index({ "followers": 1, "following": 1 }); // For complex relationship queries

// For sorting by activity, shows recently active follow relationships
FollowSchema.index({ updatedAt: -1 });

const Follow = mongoose.model('Follow', FollowSchema);
module.exports = Follow;