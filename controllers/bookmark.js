const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

// Add a post to bookmarks
const createBookmark = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.userId;

    const alreadyBookmarked = await Bookmark.findOne({ userId, postId });
    if (alreadyBookmarked) {
      return res.status(400).json({ message: 'Post already bookmarked' });
    }

    const bookmark = await Bookmark.create({ userId, postId });
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: 'Failed to bookmark post', error });
  }
};

// Get all bookmarks for a user
const fetchBookmarks = async (req, res) => {
  try {
    const userId = req.userId;
    const bookmarks = await Bookmark.find({ userId }).populate('postId');
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookmarks', error });
  }
};

// Remove a bookmark
const deleteBookmark = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;

    const deleted = await Bookmark.findOneAndDelete({ userId, postId });
    if (!deleted) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove bookmark', error });
  }
};

module.exports = { createBookmark, fetchBookmarks, deleteBookmark }
