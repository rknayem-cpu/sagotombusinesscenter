import { NextResponse } from 'next/server';
import connectDB from '@/db'; // আপনার ডাটাবেজ কানেকশন পাথ
import Order from '@/models/Order';

export const dynamic = 'force-dynamic'; // এই লাইনটি ভের্সেলের ক্যাশ অফ করে দেয়
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}