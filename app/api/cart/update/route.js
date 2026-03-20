import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { productId, action } = await req.json();
    const userId = cookies().get('userId')?.value;

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await User.findById(userId);
    const itemIndex = user.cart.findIndex(item => item.post.toString() === productId);

    if (itemIndex > -1) {
      if (action === 'inc') {
        user.cart[itemIndex].quantity += 1;
      } else if (action === 'dec') {
        if (user.cart[itemIndex].quantity > 1) {
          user.cart[itemIndex].quantity -= 1;
        } else {
          // Quantity 1 er niche gele item cart theke remove hoye jabe
          user.cart.splice(itemIndex, 1);
        }
      }
      await user.save();
      return NextResponse.json({ success: true, message: 'Cart updated' });
    }

    return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}
