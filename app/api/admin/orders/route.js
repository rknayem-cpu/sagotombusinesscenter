import { NextResponse } from 'next/server';
import connectDB from '@/db';
import Order from '@/models/Order';

// সব অর্ডার গেট করার জন্য
export async function GET() {
  try {
 connectDB();
    
    // সব অর্ডার নিয়ে আসা এবং লেটেস্ট অর্ডারগুলো উপরে রাখা (sort)
    const orders = await Order.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching orders" }, { status: 500 });
  }
}