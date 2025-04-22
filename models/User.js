const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true,
    },
    lastName: {
        type: String,
        required: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        index: true,
        sparse: true // Allow null values
    },
    clerkId: {
        type: String,
        index: true,
        unique: true,
        sparse: true
    },
    bio: {
        type: String
    },
    image: {
        type: String
    },
    followers: {
        type: Number,
        index: true // For leaderboard/sorting
    },
    following: {
        type: Number,
        index: true // For social graph analysis
    },
    posts: {
        type: Number,
        index: true // For active user sorting
    },
}, {
    timestamps: true
})

// Compound indexes
userSchema.index({ firstName: 1, lastName: 1 }); // Full name searches
userSchema.index({ followers: -1 }); // Popular users leaderboard
userSchema.index({ posts: -1, followers: -1 }); // Active/popular users
userSchema.index({ createdAt: -1 }); // New user signups
userSchema.index({ updatedAt: -1 }); // Recently active users

// Text search index (search bios or names)
userSchema.index({ 
    firstName: 'text',
    lastName: 'text',
    username: 'text',
    bio: 'text' 
});

const User = mongoose.model('User', userSchema)

module.exports = User