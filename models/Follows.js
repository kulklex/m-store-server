const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema(
  {
    followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true })

const Follow = mongoose.model('Follow', FollowSchema);
module.exports = Follow;