import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // কুকি থেকে আইডি নেওয়ার জন্য
import nodemailer from 'nodemailer';
import connectDB from '@/db';
import User from '@/models/User';

export async function POST(req) {
  try {
  connectDB();
    
    // ১. কুকি থেকে userId নেওয়া (ঠিক আপনার প্রোফাইল এপিআই এর মতো)
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ২. রিকোয়েস্ট বডি থেকে অর্ডারের ডাটা নেওয়া
    const { order } = await req.json();

    // ৩. ডাটাবেজ থেকে ইউজারের ইমেইল খুঁজে বের করা
    const user = await User.findById(userId).select('email name');
    
    if (!user || !user.email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 404 });
    }
const itemsList = order.items
  .map((item) => `- ${item.title} (x${item.quantity}) x ${item.price}taka`)
  .join('\n'); // প্রতিটি আইটেম নতুন লাইনে দেখাবে

// ২. QR Data স্ট্রিং তৈরি করা
const qrData = `
Order ID: ${order._id}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Items Detail:
${itemsList}
Delivery Charge: 80 taka
.......................................
Total: ${order.totalAmount}taka
Address: ${order.shippingAddress}
`.trim();

 const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ৫. ইমেইল পাঠানো (আপনার দেওয়া টেম্পলেট অনুযায়ী)
    const mailOptions = {
      from: `"Sagotom Bussiness Center" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Order Confirmation`,
      html: `
        <div style="font-family: Arial; padding: 20px; border: 1px solid #eee;">
        <img src="https://i.ibb.co.com/hFCwYVG1/sbc.png" width="120" alt="Sagotom Business Center Logo" style="display: block; margin: 0 auto 20px;">
          <h2 style="color: #ea580c; text-align: center;">Order Details</h2>
          <p>Hi ${user.name || 'Customer'}, your order has been placed!</p>
          
          <table width="100%" style="border-collapse: collapse; font-family: Arial, sans-serif;">
  <thead>
    <tr style="background: #f4f4f4;">
      <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Item</th>
      <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty x Price</th>
      <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
    </tr>
  </thead>
  <tbody>
    ${order.items.map(item => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">x${item.quantity} × ${item.price}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${(item.price * item.quantity)}</td>
      </tr>
    `).join('')}
  </tbody>
  
  <tfoot>
    <tr style="background: #fafafa; font-weight: bold;">
      <td colspan="2" style="padding: 10px; border: 1px solid #ddd; text-align: right;">Grand Total:</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #ea580c; font-size: 16px;">
        ${order.totalAmount} taka
      </td>
    </tr>
  </tfoot>
</table>

          <div style="text-align: center; margin-top: 25px;">
            <p><strong>Scan for order details:</strong></p>
            <img src="${qrCode}" width="150" height="150" alt="QR Code">
          </div>
          
          <p style="text-align: center; margin-top: 20px; color: #666;">
            Grand Total: <strong>$${order.totalAmount}</strong><br>
            Thank you for shopping with us!
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('Email Send Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}