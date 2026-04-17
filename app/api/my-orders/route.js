import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/db';
import User from '@/models/User';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    connectDB();

    // 1. Cookie theke userId neya
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. User find kora (password bad diye)
    const user = await User.findById(userId).select('-password').populate('orders'); // orders populate kora

    if (!user) {
      // User na paile cookie clear kore deya
      const response = NextResponse.json({ error: 'User not found' }, { status: 404 });
      response.cookies.delete('userId');
      return response;
    }

    // 3. Success Response
    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error('Profile Fetch Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
