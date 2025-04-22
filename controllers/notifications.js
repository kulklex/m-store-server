const Notification = require('../models/Notification');

// Create a notification
const createNotification = async (req, res) => {
  try {
    const { receiverId, senderId, type, postId, commentId } = req.body;

    const notification = new Notification({
      receiverId,
      senderId,
      type,
      postId,
      commentId
    });

    await notification.save();

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create notification', error: error.message });
  }
};

// Get notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ receiverId: userId })
      .populate('senderId', 'username image')
      .populate('postId')
      .populate('commentId')
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.updateMany({ receiverId: userId, isRead: false }, { $set: { isRead: true } });

    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notifications', error: error.message });
  }
};

module.exports = {  createNotification, getUserNotifications, markAllAsRead };
