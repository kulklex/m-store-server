const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    userId: {
          type: String, // Clerk ID
          required: true
        },
    postId: {
          type: mongoose.Schema.Types.ObjectId, // References the Post by MongoDB _id
          ref: 'Post',
          required: true
        },
}, {
    timestamps: true
})


const Likes = mongoose.model('Likes', likeSchema)

module.exports = Likes