import { NextResponse } from 'next/server';
import connectDB from '@/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    connectDB();
    const { email, password } = await req.json();

    // 1. User find kora
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Password check (Ekhane direct check kora hoyeche apnar code onujayi)
    // Pro tip: Real project-e bcrypt.compare() use kora bhalo
    const isValidPassword = user.password === password;
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // 3. Response create kora
    const response = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );

    // 4. Set authentication cookie (HttpOnly for security)
    response.cookies.set('userId', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 1 day in seconds
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
