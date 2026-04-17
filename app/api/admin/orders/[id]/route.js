import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
import { cookies } from 'next/headers';
import connectDB from '@/db';
import Order from '@/models/Order';
import User from '@/models/User'; // ইউজার মডেল ইমপোর্ট করুন
import nodemailer from 'nodemailer';

// অর্ডার স্ট্যাটাস আপডেট এবং ইমেইল পাঠানোর জন্য
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { status } = await req.json();

    // ১. কুকি থেকে userId বের করা (ইমেইল পাওয়ার জন্য)
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    // ২. ডাটাবেজে স্ট্যাটাস আপডেট করা
   const timestampField = `${status.toLowerCase()}At`; 
    // যেমন: status "Shipped" হলে ফিল্ড হবে "shippedAt"

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        status: status,
        $set: { [`statusHistory.${timestampField}`]: new Date() } // এখানে টাইম সেভ হচ্ছে
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // ৩. স্ট্যাটাস যদি 'Delivered' হয় এবং userId থাকে, তবে ইমেইল পাঠাও
    if (status === "Delivered" && userId) {
      try {
        // ইউজার খুঁজে বের করা শুধুমাত্র ইমেইল ফিল্ড নিয়ে
        const user = await User.findById(userId).select('email');

        if (user && user.email) {
          // আইটেম লিস্ট জেনারেট করা
          const itemsList = updatedOrder.items
            .map((item) => `- ${item.title} (x${item.quantity}) x ${item.price}taka`)
            .join('\n');

          // QR Data স্ট্রিং তৈরি
          const qrData = `
Order ID: ${updatedOrder._id}
Date: ${new Date(updatedOrder.createdAt).toLocaleDateString()}
Items Detail:
${itemsList}
Delivery Charge: 80 taka
.......................................
Total: ${updatedOrder.totalAmount}taka
Address: ${updatedOrder.shippingAddress}
`.trim();

          // Google API / QR Server দিয়ে QR Code URL তৈরি
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

          // নোডমেইলার ট্রান্সপোর্টার সেটআপ
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          // ইমেইল কন্টেন্ট
          const mailOptions = {
            from: `"Sagotom Bussiness Center" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "আপনার অর্ডারটি ডেলিভার করা হয়েছে! 🎉",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 15px; padding: 30px; color: #374151;">
                <h2 style="color: #16a34a; text-align: center;">অভিনন্দন!</h2>
                <p style="font-size: 16px; text-align: center;">আপনার অর্ডারটি সফলভাবে ডেলিভার করা হয়েছে। আশা করি খুব শীঘ্রই আপনি প্রোডাক্টটি হাতে পাবেন।</p>
                
                <div style="background: #f9fafb; padding: 20px; border-radius: 12px; text-align: center; margin: 25px 0;">
                  <p style="font-weight: bold; margin-bottom: 10px; color: #4b5563;">অর্ডারের বিস্তারিত জানতে নিচের QR কোডটি স্ক্যান করুন:</p>
                  <img src="${qrCodeUrl}" alt="QR Code" style="width: 180px; height: 180px; border: 5px solid #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
                </div>

                <p style="font-size: 14px; text-align: center; color: #6b7280;">বিস্তারিত জানতে qr code টি scan করুন। ধন্যবাদ আমাদের সাথে থাকার জন্য।</p>
              </div>
            `,
          };

          // ইমেইল পাঠানো
          await transporter.sendMail(mailOptions);
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // ইমেইল না গেলেও এপিআই রেসপন্স সাকসেস দেখাবে যাতে ইউজার এক্সপেরিয়েন্স নষ্ট না হয়
      }
    }

    return NextResponse.json({ success: true, message: "Order updated!", data: updatedOrder });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}



// অর্ডার ডিলিট করার জন্য (আগের মতোই থাকছে)
export async function DELETE(req, { params }) {
  try {
   connectDB(); // await নিশ্চিত করুন
    const { id } = params;
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 403 });
    }

    // ১. চেক করার সময় String এ কনভার্ট করে চেক করুন
    const hasOrder = user.orders.some(orderId => orderId.toString() === id);

    if (!hasOrder) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // ২. ফিল্টার করার সময়ও toString() ব্যবহার করুন
    user.orders = user.orders.filter(orderId => orderId.toString() !== id);
    
    // ৩. অনেক সময় সরাসরি অ্যারে আপডেট করলে Mongoose বুঝতে পারে না, তাই explicit মার্কিং (ঐচ্ছিক কিন্তু নিরাপদ)
    user.markModified('orders'); 
    await user.save();

    // ৪. অর্ডার ডিলিট
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error(error); // এরর লগ করলে সমস্যা ধরতে সুবিধা হবে
    return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 });
  }
}