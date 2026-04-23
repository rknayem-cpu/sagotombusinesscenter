import { NextResponse } from 'next/server';
import connectDB from '@/db';
import Order from '@/models/Order';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { status } = await req.json();

    // ১. স্ট্যাটাস অনুযায়ী সঠিক টাইমস্ট্যাম্প ফিল্ড সিলেক্ট করা
    const timestampField = `${status.toLowerCase()}At`; 

    // ২. অর্ডার আপডেট (Fresh Data)
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        status: status,
        $set: { [`statusHistory.${timestampField}`]: new Date() }
      },
      { new: true }
    ).populate("user"); // User populate korle email pawa soja hobe
console.log("Recipient Email:", updatedOrder.user?.email);
    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // ৩. ডেলিভারি হলে ইমেইল পাঠানোর লজিক (Guest ও Registered উভয়ের জন্য)
    if (status === "Delivered") {
      try {
        // ইমেইল কার কাছে যাবে? 
        // যদি ইউজার লগইন করা থাকে তবে user.email, নাহলে অর্ডারে দেয়া কোনো কন্টাক্ট (যদি ইমেইল ফিল্ড থাকে)
        const recipientEmail = updatedOrder.user?.email || null; 

        if (recipientEmail) {
          const itemsList = updatedOrder.items
            .map((item) => `- ${item.title} (x${item.quantity})`)
            .join('\n');

          const qrData = `Order ID: ${updatedOrder._id}\nTotal: ${updatedOrder.totalAmount}tk\nAddress: ${updatedOrder.shippingAddress}`;
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          await transporter.sendMail({
            from: `"Sagotom Business Center" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: "আপনার অর্ডারটি ডেলিভার করা হয়েছে! 🎉",
            html: `<div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 15px; padding: 30px; color: #374151;">
                <h2 style="color: #16a34a; text-align: center;">অভিনন্দন!</h2>
                <p style="font-size: 16px; text-align: center;">আপনার অর্ডারটি সফলভাবে ডেলিভার করা হয়েছে। আশা করি খুব শীঘ্রই আপনি প্রোডাক্টটি হাতে পাবেন।</p>
                
                <div style="background: #f9fafb; padding: 20px; border-radius: 12px; text-align: center; margin: 25px 0;">
                  <p style="font-weight: bold; margin-bottom: 10px; color: #4b5563;">অর্ডারের বিস্তারিত জানতে নিচের QR কোডটি স্ক্যান করুন:</p>
                  <img src="${qrCodeUrl}" alt="QR Code" style="width: 180px; height: 180px; border: 5px solid #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
                </div>

                <p style="font-size: 14px; text-align: center; color: #6b7280;">বিস্তারিত জানতে qr code টি scan করুন। ধন্যবাদ আমাদের সাথে থাকার জন্য।</p>
              </div>` // আগের HTML ই থাকবে
          });
        }
      } catch (emailError) {
        console.error("Email Error:", emailError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Order updated!", 
      data: updatedOrder 
    }, {
      headers: { 'Cache-Control': 'no-store' } // Cache bypass
    });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}