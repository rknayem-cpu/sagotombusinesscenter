import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // কোন ইউজার অর্ডার করেছে তার রেফারেন্স
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // অর্ডারের আইটেমগুলো (Array of objects)
  items: [
    {
      title: { type: String, required: true },
      imgUrl: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  // টোটাল কত টাকা পে করবে
  totalAmount: {
    type: Number,
    required: true,
  },
  // শিপিং ডিটেইলস
  shippingAddress: {
    type: String,
    required: [true, 'Shipping address is required'],
  },
  phone: {
    type: String,
    required: [true, 'Mobile number is required'],
  },
  // পেমেন্ট স্ট্যাটাস (যেহেতু ক্যাশ অন ডেলিভারি, তাই ডিফল্ট 'Pending')
  paymentStatus: {
    type: String,
    default: 'Cash on Delivery',
  },
  // অর্ডারের বর্তমান অবস্থা (Admin কন্ট্রোল করতে পারবে)
  status: {
    type: String,
    default: 'Pending',
  },
}, { 
  timestamps: true // এটি অর্ডার দেওয়ার সময় (createdAt) ট্র্যাক করবে
});

// Next.js-এর মডেল ওভাররাইট প্রিভেন্ট করার জন্য
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;