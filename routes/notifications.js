const express = require('express');
const router = express.Router();
const { clerkVerifyToken } = require('../middlewares/verifyClerkToken');

const { createNotification, getUserNotifications, markAllAsRead } = require('../controllers/notifications');

router.post('/', clerkVerifyToken, createNotification);
router.get('/:userId', clerkVerifyToken, getUserNotifications);
router.put('/read/:userId', clerkVerifyToken, markAllAsRead);

module.exports = router;
