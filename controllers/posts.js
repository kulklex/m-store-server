const Post = require('../models/Post');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary for image storage
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// CREATE POST
const createPost = async (req, res) => {
  try {
    const { caption, clerkId, imageUrl } = req.body; //imageUrl is expected from frontend

    if (!clerkId || !imageUrl) {
      return res.status(400).json({ error: 'Clerk ID and image Url are required' });
    }

    // Find the user by clerkId
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

     // Extract public_id from Cloudinary URL
     const publicId = imageUrl.split('/').pop().split('.')[0];

     const newPost = new Post({
        caption,
        imageUrl, // Directly use the Cloudinary URL
        cloudinaryId: publicId, // Store for future deletion
        userId: user.clerkId,
        likes: 0,
        comments: 0,
      });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// UPDATE POST CAPTION (no image changes)
const updatePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { caption } = req.body;
  
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { caption },
        { new: true }
      );
  
      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.status(200).json({ message: 'Post caption updated', post: updatedPost });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update post' });
    }
  };

// UPDATE POST IMAGE ONLY
const updatePostImage = async (req, res) => {
    try {
      const { postId } = req.params;
      const { imageUrl } = req.body; // Frontend sends new Cloudinary URL
  
      if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL is required' });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Delete old image from Cloudinary if exists
      if (post.cloudinaryId) {
        await cloudinary.uploader.destroy(post.cloudinaryId);
      }
  
      // Extract public_id from new URL
      const publicId = imageUrl.split('/').pop().split('.')[0];
  
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { 
          imageUrl,
          cloudinaryId: publicId 
        },
        { new: true }
      );
  
      res.status(200).json({ 
        message: 'Post image updated successfully', 
        post: updatedPost 
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update post image' });
    }
  };

// DELETE POST
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Delete image from Cloudinary if it exists
    if (post.cloudinaryId) {
      await cloudinary.uploader.destroy(post.cloudinaryId);
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

// GET ALL POSTS (With User Data)
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        // Manually fetch user details using clerkId
        const postsWithUser = await Promise.all(posts.map(async (post) => {
            const user = await User.findOne({ clerkId: post.userId }).select('firstName lastName email image');
            return { ...post._doc, user };
        }));

        res.status(200).json(postsWithUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

// GET A SINGLE POST (With User Data)
const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const user = await User.findOne({ clerkId: post.userId }).select('firstName lastName email image');
        res.status(200).json({ ...post._doc, user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
}

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  updatePostImage,
  deletePost
};
