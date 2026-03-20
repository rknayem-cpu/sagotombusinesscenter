import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // 1. Cookie theke UserId check kora
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    // User login na thakle count 0 dekhabe
    if (!userId) {
      return NextResponse.json({ success: true, count: 0 });
    }

    // 2. Sudhu cart field-ta fetch kora (Optimization)
    const user = await User.findById(userId).select('cart');

    if (!user || !user.cart) {
      return NextResponse.json({ success: true, count: 0 });
    }

    // 3. Logic: Jodi cart-e 2 dhoronir product thake kintu ekta 5-ta arekta 2-ta hoy,
    // tobe total count 7 dekhabe (Standard E-commerce Rule).
    const totalCount = user.cart.reduce((acc, item) => acc + (item.quantity || 0), 0);

    return NextResponse.json({ 
      success: true, 
      count: totalCount 
    }, { status: 200 });

  } catch (error) {
    console.error('Cart count error:', error);
    return NextResponse.json(
      { success: false, error: 'Database error' }, 
      { status: 500 }
    );
  }
}
