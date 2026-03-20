import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  imgUrl: {
    type: String,
    required: [true, 'Primary image is required'],
  },
  imgUrl2: {
    type: String,
    default: '', // Optional image
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  category: {
    type: String, // Ekhon ekhane ja pathaben shetai save hobe
    required: [true, 'Category is required'],
  },
}, { 
  timestamps: true // Eita auto 'createdAt' ar 'updatedAt' create korbe
});

// Overwrite error theke bachar jonno Next.js specific export
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
