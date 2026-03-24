import { NextResponse } from 'next/server';
import connectDB from '@/db';
import Order from '@/models/Order';

export async function GET(req, { params }) {
  try {
    // ১. ডাটাবেজ কানেক্ট করা
    connectDB();

    // ২. URL থেকে ID টি নেওয়া
    const { id } = params;

    // ৩. আইডি দিয়ে অর্ডারটি খুঁজে বের করা
    // এখানে .lean() ব্যবহার করা হয়েছে দ্রুত পারফরম্যান্সের জন্য
    const order = await Order.findById(id);

    // ৪. অর্ডার না পাওয়া গেলে ৪-০-৪ এরর
    if (!order) {
      return NextResponse.json(
        { success: false, message: "অর্ডারটি পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    // ৫. সফল হলে অর্ডারের ডাটা রিটার্ন করা
    return NextResponse.json(
      { success: true, data: order },
      { status: 200 }
    );

  } catch (error) {
    console.error("Single Order Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভারে সমস্যা হয়েছে।", error: error.message },
      { status: 500 }
    );
  }
}