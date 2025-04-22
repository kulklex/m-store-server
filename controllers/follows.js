const User = require('../models/User');

// Follow a user
const followUser = async (req, res) => {
  const { targetUserId } = req.params;
  const currentUserId = req.user.id;  

  if (targetUserId === currentUserId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: 'Followed user successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  const { targetUserId } = req.params;
  const currentUserId = req.user.id;

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: 'Unfollowed user successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mutual Following
const getMutualFollowing = async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const user1 = await User.findById(userId1).populate('following', '_id username image');
    const user2 = await User.findById(userId2).populate('following', '_id username image');

    if (!user1 || !user2) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    const mutuals = user1.following.filter(person =>
      user2.following.some(u => u._id.toString() === person._id.toString())
    );

    res.status(200).json({ mutualFollowing: mutuals });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Mutual Followers
const getMutualFollowers = async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const user1 = await User.findById(userId1).populate('followers', '_id username image');
    const user2 = await User.findById(userId2).populate('followers', '_id username image');

    if (!user1 || !user2) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    const mutuals = user1.followers.filter(person =>
      user2.followers.some(u => u._id.toString() === person._id.toString())
    );

    res.status(200).json({ mutualFollowers: mutuals });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


module.exports = { followUser, unfollowUser, getMutualFollowers, getMutualFollowing, };
