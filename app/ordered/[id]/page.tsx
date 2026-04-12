"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, Copy, ShoppingBag, MapPin, Calendar, Hash, QrCode } from 'lucide-react';
import Swal from 'sweetalert2';

interface Order {
  _id: string;
  items: any[];
  totalAmount: number;
  shippingAddress: string;
  phone: string;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`); // Single order fetch API
        const data = await res.json();
       if (data.success) {
        setOrder(data.data); // ১. স্ক্রিনে ডাটা দেখানোর জন্য
        // ২. ডাটা পাওয়া মাত্রই ইমেইল পাঠানোর ফাংশন কল হবে
        sendEmail(data.data); 
      }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);


const sendEmail = async (orderDetail: any) => {
  // ১. একবার ইমেইল গেলে যেন বারবার না যায় (রিফ্রেশ করলে যেন আবার না যায়)
  const isSent = sessionStorage.getItem(`sent_${orderDetail._id}`);
  if (isSent) return;

  try {
    // ২. আমাদের নতুন বানানো ইমেইল এপিআই-কে কল করা
    await fetch('/api/send-qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: orderDetail }) 
    });
    
    // ৩. সেশন স্টোরেজে সেভ করে রাখা যে ইমেইল পাঠানো হয়েছে
    sessionStorage.setItem(`sent_${orderDetail._id}`, 'true');
  } catch (err) {
    console.error("Email API Error:", err);
  }
};





  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Order ID Copied!',
      showConfirmButton: false,
      timer: 1500
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white italic font-bold">Loading Order...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found!</div>;

  // QR Code Data Logic
  // ১. আইটেমগুলোর নাম এবং কোয়ান্টিটি একটি সুন্দর লিস্ট ফরম্যাটে নিয়ে আসা
const itemsList = order.items
  .map((item: any) => `- ${item.title} (x${item.quantity}) x ${item.price}taka`)
  .join('\n'); // প্রতিটি আইটেম নতুন লাইনে দেখাবে

// ২. QR Data স্ট্রিং তৈরি করা
const qrData = `
Order ID: ${order._id.slice(-8).toUpperCase()}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Items Detail:
${itemsList}
Delivery Charge: 80 taka
.......................................
Total: ${order.totalAmount}taka
Address: ${order.shippingAddress}
`.trim();

// ৩. URL Friendly করার জন্য Encode করা
const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  
return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Success Header */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 text-center shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-orange-600"></div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-600 rounded-full mb-6 animate-bounce">
            <CheckCircle2 size={40} />
          </div>
          
          <h1 className="text-4xl font-black text-gray-950 tracking-tighter leading-none mb-2">ORDER PLACED!</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Thank you for your purchase</p>

          {/* Order ID Box */}
          <div className="mt-10 p-5 bg-gray-50 rounded-2xl border border-dashed border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Your Order ID</span>
              <p className="font-mono font-bold text-gray-950 text-sm md:text-base">{order._id}</p>
            </div>
            <button 
              onClick={() => copyToClipboard(order._id)}
              className="flex items-center gap-2 bg-gray-950 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all active:scale-95"
            >
              <Copy size={14} /> Copy ID
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 items-center text-left">
            {/* Details List */}
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><ShoppingBag size={18}/></div>
                <div>
                  <span className="block text-[10px] font-black text-gray-400 uppercase">Items Ordered</span>
                  <p className="font-bold text-gray-900">{order.items.length} Products</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Calendar size={18}/></div>
                <div>
                  <span className="block text-[10px] font-black text-gray-400 uppercase">Order Date</span>
                  <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><MapPin size={18}/></div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] font-black text-gray-400 uppercase">Ship To</span>
                  <p className="font-bold text-gray-900 truncate">{order.shippingAddress}</p>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center p-6 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-gray-100">
               <div className="bg-gray-50 p-3 rounded-2xl mb-4">
                  <img src={qrCodeUrl} alt="Order QR Code" className="w-32 h-32 md:w-40 md:h-40 object-contain" />
               </div>
               <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] flex items-center gap-2">
                 <QrCode size={14} /> Scan for info
               </span>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row gap-4 justify-center">
             <button onClick={() => window.print()} className="px-8 py-4 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition">Print Invoice</button>
             <button onClick={() => router.push('/')} className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition shadow-lg shadow-orange-100">Continue Shopping</button>
          </div>
        </div>

      </div>
    </div>
  );
}