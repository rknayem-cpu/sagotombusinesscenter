import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/db';
import Order from '@/models/Order';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();

    // userId optional rakhchi jate Guest user order korte pare
    const userId = cookies().get('userId')?.value || null;

    const body = await req.json();
    const { items, totalAmount, customerInfo } = body;

    // Validation
    if (!items || items.length === 0 || !customerInfo?.mobile || !customerInfo?.address || !customerInfo?.name) {
      return NextResponse.json({ success: false, message: "সবগুলো তথ্য সঠিকভাবে প্রদান করুন।" }, { status: 400 });
    }

    const generateShortId = () => {
  // ১০০০১০ থেকে ৯৯৯৯৯০ পর্যন্ত একটি র‍্যান্ডম নাম্বার জেনারেট করা
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `SBC-${randomDigits}`;
};
    // ১. অর্ডার অবজেক্ট তৈরি
    const orderPayload = {
      // User login thakle ID jabe, na thakle null thakbe (Guest Order)
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
      name: customerInfo.name,
      status: 'Pending',
      orderId: generateShortId(), // Unique Order ID
      statusHistory: {
        pendingAt: new Date(),
      },
      paymentStatus: 'Cash on Delivery'
    };

    const newOrder = await Order.create(orderPayload);

    // ২. ইউজার লগইন করা থাকলে তার ডাটা আপডেট করুন
    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, { 
          $set: { cart: [] }, // DB cart clear (jodi thake)
          $push: { orders: newOrder._id } 
        });
      } catch (userErr) {
        console.error("User model update error:", userErr);
        // User update na holeo order cancel korar dorkar nai
      }
    }

    // --- ৩. ফেসবুক পিক্সেল (Conversions API) ---
    // (Pixel logic exact ager motoi thakbe)
    try {
      const pixelId = process.env.FB_PIXEL_ID;
      const accessToken = process.env.FB_ACCESS_TOKEN;
      if (pixelId && accessToken) {
        const fbUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
        fetch(fbUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: [{
              event_name: 'Purchase',
              event_time: Math.floor(Date.now() / 1000),
              action_source: 'website',
              user_data: {
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
        }).catch(err => console.error("FB CAPI Error:", err));
      }
    } catch (fbErr) {
      console.error("FB Tracking Error:", fbErr);
    }

    return NextResponse.json({ 
      success: true, 
      message: "অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!", 
      orderId: newOrder.orderId // Client ke orderId pathano jate tar status check korte pare
    }, { status: 201 });

  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ success: false, message: "সার্ভারে সমস্যা হয়েছে।" }, { status: 500 });
  }
}