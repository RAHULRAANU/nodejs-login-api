const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

  title: { 
    type: String,
    required: true
 },

  body: { 
    type: String,
    required: true
 },

  createdBy: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
     },

  active: { 
    type: Boolean,
     default: true
     },

  geoLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },

}, 
{
 timestamps: true
}
);

// Add a compound index for geSpatial queries

postSchema.index({ geoLocation: '2dsphere' });

// Compound index to allow a user to create up to 10 posts
// postSchema.index({ createdBy: 1, createdAt: 1 }, { unique: true, sparse: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
