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


    if (!items || items.length === 0 || !customerInfo.mobile || !customerInfo.address || !customerInfo.name) {
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
      name: customerInfo.name, // যদি নাম না থাকে তবে ডিফল্ট মান
      status: 'Pending',
      paymentStatus: 'Cash on Delivery'
    });

    // ২. ইউজারের ডাটা আপডেট করুন
    await User.findByIdAndUpdate(userId, { 
      $set: { cart: [] },
      $push: { orders: newOrder._id } 
    });

    // --- ৩. ফেসবুক পিক্সেল (Conversions API) ট্র্যাকিং শুরু ---
    try {
      const pixelId = process.env.FB_PIXEL_ID;
      const accessToken = process.env.FB_ACCESS_TOKEN;
      const fbUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;

      // এটি ব্যাকগ্রাউন্ডে চলবে, ইউজারের রেসপন্স আটকাবে না
      fetch(fbUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            user_data: {
              // ফোন নম্বর সরাসরি পাঠানো যায়, ফেসবুক সেটাকে নিজে ম্যাচ করে নেয়
              ph: [customerInfo.mobile], 
              client_ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
              client_user_agent: req.headers.get('user-agent'),
            },
            custom_data: {
              value: Number(totalAmount),
              currency: 'BDT',
              content_type: 'product',
              num_items: items.length
            }
          }]
        })
      }).catch(err => console.error("FB Conversion API Error:", err));
    } catch (fbErr) {
      console.error("FB Tracking Setup Error:", fbErr);
    }
    // --- ফেসবুক ট্র্যাকিং শেষ ---

    return NextResponse.json({ 
      success: true, 
      message: "অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!", 
      orderId: newOrder._id 
    }, { status: 201 });

  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ success: false, message: "সার্ভারে সমস্যা হয়েছে।" }, { status: 500 });
  }
}