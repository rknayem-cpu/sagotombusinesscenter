import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    address: {
      type: String,
    },
    cart: [
      {
        post: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Post' 
        },
        quantity: { 
          type: Number, 
          default: 1, 
          min: 1 
        },
      },
    ],
  },
  {
    // Automatic createdAt ebong updatedAt field create korbe
    timestamps: true,
  }
);

// Next.js hot reloading-er karone model jeno bar bar create na hoy sheta check kora dorkar
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
