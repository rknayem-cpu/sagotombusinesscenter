import { NextResponse } from 'next/server';
import connectDB from '@/db';
import User from '@/models/User';
import Unuser from '@/models/Unuser';

export async function POST(req) {
  try {
    connectDB();
    const { otp } = await req.json();

    // 1. Unuser collection-e OTP diye user khoja
    const tempUser = await Unuser.findOne({ otp });

    if (!tempUser) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    // 2. Main User collection-e create kora (Spreed operator use kore short kora hoyeche)
    const { name, email, address, password } = tempUser;
    await User.create({ name, email, address, password });

    // 3. Temporary data delete kora
    await Unuser.findByIdAndDelete(tempUser._id);

    return NextResponse.json({ message: 'Success! Redirecting...' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
