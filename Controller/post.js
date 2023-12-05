const Post = require("../Model/post");


// @desc    Post Registration
// @route   POST api/post/register
// @access  Public

exports.register = async (req, res, next) => {
  try {

    // Create a new post
    req.body.createdBy = req.user.id;
    
    const post = new Post(req.body);
    await post.save();

    return res.json({ message: 'Post created successfully', post });
    
  } catch (error) {
    console.error('Error creating post:', error);

    return next(error);  }
};





  // @desc    Post Update
  // @route   POST api/post/update/:id
  // @access  private

  exports.updatePost = async (req, res, next) => {

    try {
      const userId = req.user.id;
      const postId = req.params.id; // Assuming the post ID is part of the request parameters

      // Check if the post exists and is created by the authenticated user
      const existingPost = await Post.findOne({ _id: postId, createdBy: userId });

      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found or you are not authorized to update it.' });
      }

      // Update the post with the new data
      const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
        new: true,
        runValidators: true,
      });

      return res.json({ message: 'Post updated successfully', post: updatedPost });

    } catch (error) {
      console.error('Error updating post:', error);
      return next(error);
    }
  };





// @desc    Delete Update
// @route   DELETE api/post/delete/:id
// @access  private

exports.deletePost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id; // Assuming the post ID is part of the request parameters

    // Check if the post exists and is created by the authenticated user
    const existingPost = await Post.findOne({ _id: postId, createdBy: userId });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found or you are not authorized to delete it.' });
    }

    // Delete the found post
    await existingPost.deleteOne();

    return res.json({ message: 'Post deleted successfully' });

  } catch (error) {
    console.error('Error deleting post:', error);
    return next(error);
  }
};




// @desc    GET Post
// @route   GET api/post/userPost
// @access  private

exports.getPostsByUser = async (req, res, next) => {
  try {

    // Find posts created by the authenticated user
    const userPosts = await Post.find({ createdBy: req.user.id });

    return res.json({ message: 'User posts retrieved successfully', posts: userPosts });

  } catch (error) {
    console.error('Error getting user posts:', error);
    return next(error);
  }
};


// @desc    GET Post
// @route   GET /api/post/geoLocation?latitude=47.09&longitude=77.10
// @access  private

exports.getPostsByLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    console.log('Received request with coordinates:', latitude, longitude);

    // Find posts near the specified location
    const posts = await Post.find({
      geoLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000, // Example: 10 kilometers
        },
      },
    });

    console.log('Found posts:', posts);

    return res.json({ message: 'Posts retrieved successfully based on location', posts });
  } catch (error) {
    console.error('Error getting posts by location:', error);
    return next(error);
  }
};




// @desc    GET Post
// @route   GET /api/post/getPost
// @access  private

exports.getPostCounts = async (req, res, next) => {
  try {

    // Count active and inactive posts
    const activeCount = await Post.countDocuments({ active: true });
    const inactiveCount = await Post.countDocuments({ active: false });

    return res.json({
      message: 'Post counts retrieved successfully',
      activeCount,
      inactiveCount,
    });
    
  } catch (error) {
    console.error('Error getting post counts:', error);
    return next(error);
  }
};

