import { NextResponse } from 'next/server';
import connectDB from '@/db';
import User from '@/models/User';
import Unuser from '@/models/Unuser';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    connectDB()
    const { name, email, address, password } = await req.json();

    // 1. Quick Validation
    if (!name || !email || !address || !password) 
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });

    // 2. Double Check: User exists?
    if (await User.findOne({ email })) 
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });

    // 3. Generate OTP & Save Temp User
    const otp = Math.floor(1000 + Math.random() * 9000);
    await Unuser.create({ name, email, address, password, otp });

    // 4. Send Email (Transporter inline for brevity)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Ba apnar provider
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: '"SagotombussinessCenter.com" <info@sbc.com>',
      to: email,
      subject: 'OTP Code - SBC.com',
      html: `Your OTP is: <b>${otp}</b>`
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
