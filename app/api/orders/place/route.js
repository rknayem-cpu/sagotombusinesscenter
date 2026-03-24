import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/db';
import Order from '@/models/Order';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();

    const userId = cookies().get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ success: false, message: "অর্ডার করতে লগইন করুন।" }, { status: 401 });
    }

    const body = await req.json();
    const { items, totalAmount, customerInfo } = body;

    if (!items || items.length === 0 || !customerInfo.mobile || !customerInfo.address) {
      return NextResponse.json({ success: false, message: "সবগুলো তথ্য সঠিকভাবে প্রদান করুন।" }, { status: 400 });
    }

    // ১. প্রথমে অর্ডার তৈরি করুন
    const newOrder = await Order.create({
      user: userId,
      items: items.map(item => ({
        title: item.title,
        imgUrl: item.imgUrl,
        quantity: item.quantity,
        price: Number(item.price)
      })),
      totalAmount: Number(totalAmount),
      shippingAddress: customerInfo.address,
      phone: customerInfo.mobile,
      status: 'Pending',
      paymentStatus: 'Cash on Delivery'
    });

    // ২. ইউজারের ডাটা আপডেট করুন (কার্ট খালি করা এবং অর্ডার লিস্টে আইডি পুশ করা)
    // আমরা একসাথে $set (কার্ট খালি) এবং $push (অর্ডার আইডি সেভ) করতে পারি
    await User.findByIdAndUpdate(userId, { 
      $set: { cart: [] },
      $push: { orders: newOrder._id } 
    });

    return NextResponse.json({ 
      success: true, 
      message: "অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!", 
      orderId: newOrder._id 
    }, { status: 201 });

  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ success: false, message: "সার্ভারে সমস্যা হয়েছে।" }, { status: 500 });
  }
}