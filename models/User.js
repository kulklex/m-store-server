const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    clerkId: {
        type: String
    },
    bio: {
        type: String
    },
    image: {
        type: String
    },
    followers: {
        type: Number
    },
    following: {
        type: Number
    },
    posts: {
        type: Number
    },
}, {
    timestamps: true
})


const User = mongoose.model('User', userSchema)

module.exports = User