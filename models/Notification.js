const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'reply', 'mention'],
    required: true,
    index: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    index: true // Conditionally used based on type
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    index: true // Conditionally used based on type
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true // Important for filtering unread notifications
  }
}, {
  timestamps: true
});

// Compound indexes for common query patterns
notificationSchema.index({ receiverId: 1, isRead: 1 }); // Get user's unread notifications
notificationSchema.index({ receiverId: 1, createdAt: -1 }); // Get user's notifications sorted by recent
notificationSchema.index({ receiverId: 1, type: 1, isRead: 1 }); // Filter by notification type
notificationSchema.index({ senderId: 1, receiverId: 1, type: 1 }); // Prevent duplicate notifications
notificationSchema.index({ postId: 1, type: 1 }); // For post-related notifications
notificationSchema.index({ commentId: 1, type: 1 }); // For comment-related notifications

// For analytics and cleanup
notificationSchema.index({ createdAt: 1 }); // TTL or archival purposes
notificationSchema.index({ isRead: 1, createdAt: 1 }); // For cleaning up old read notifications

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;