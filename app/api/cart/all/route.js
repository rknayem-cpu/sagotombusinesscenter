import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/db';
import User from '@/models/User';
import Post from '@/models/Post'; // Product model ta import thakte hobe

export async function GET() {
  try {
    await connectDB();
    const userId = cookies().get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // User khuje ber kora ebong 'cart.post' field-ti Product model theke populate kora
    const user = await User.findById(userId).populate({
      path: 'cart.post',
      model: Post
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user.cart }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
