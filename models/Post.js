const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    caption: {
        type: String
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    storageId: {
        type: String,
    },
    likes: {
        type: Number,
        required: true
    },
    comments: {
        type: Number,
        required: true
    },
}, {timestamps: true})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
