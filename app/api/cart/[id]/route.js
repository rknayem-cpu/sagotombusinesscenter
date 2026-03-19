import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/db';
import User from '@/models/User';

export async function GET(req, { params }) {
  try {
    connectDB();
    const { id } = params; // URL theke ID neya

    // 1. Cookie theke UserId neya
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Please login first' }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Cart logic: Product ki agei ache?
    const existingIndex = user.cart.findIndex(
      (item) => item.post && item.post.toString() === id
    );

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity += 1;
    } else {
      user.cart.push({ post: id, quantity: 1 });
    }

    // 3. Save and Response
    await user.save();

    return NextResponse.json({ message: 'Item added to cart' }, { status: 200 });

  } catch (error) {
    console.error('Cart error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}
