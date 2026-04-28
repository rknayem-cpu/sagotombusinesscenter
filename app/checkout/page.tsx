"use client";
import React, { useEffect, useState } from 'react';
import * as fbq from '@/lib/fpixel';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, CreditCard, Loader2, ShoppingBag, ArrowLeft, User } from 'lucide-react';
import Swal from 'sweetalert2';

export default function CheckoutPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '', address: '' });

 useEffect(() => {
  // ১. LocalStorage থেকে ডাটা চেক করা
  const savedData = localStorage.getItem('pendingOrder');
  
  if (!savedData) {
    router.push('/cart');
  } else {
    const parsedData = JSON.parse(savedData);
    setOrderData(parsedData);

    // --- FACEBOOK PIXEL: InitiateCheckout START ---
    fbq.event('InitiateCheckout', {
      content_ids: parsedData.items.map((item: any) => item._id), // চেকআউটে থাকা সব প্রোডাক্টের আইডি
      content_type: 'product',
      value: parsedData.totalAmount, // মোট টাকার পরিমাণ
      currency: 'BDT',
      num_items: parsedData.items.length // কয়টি আইটেম আছে
    });
    // --- FACEBOOK PIXEL: InitiateCheckout END ---
  }
}, [router]);





  const handlePlaceOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.name || !formData.mobile || !formData.address) {
    return Swal.fire("Missing Info", "Please fill all the fields", "warning");
  }

  setLoading(true);
  try {
    const res = await fetch('/api/orders/place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        customerInfo: formData,
      })
    });

    const result = await res.json();

    if (result.success) {
      
      // --- FACEBOOK PIXEL PURCHASE TRACKING ---
      fbq.event('Purchase', {
        value: orderData.totalAmount,
        currency: 'BDT',
        content_type: 'product',
        content_ids: orderData.items.map((item: any) => item._id), // সব প্রোডাক্টের আইডি
        num_items: orderData.items.length,
      });

      // --- অর্ডার সাকসেস হলে সব ক্লিয়ার করা ---
      localStorage.removeItem('pendingOrder'); 
      localStorage.removeItem('cart'); 
      
      window.dispatchEvent(new Event('cartUpdated')); 
      
      Swal.fire({
        icon: 'success',
        title: 'অর্ডার সফল হয়েছে!',
        text: 'আপনার অর্ডারটি আমরা পেয়েছি।',
        confirmButtonColor: '#ea580c'
      }).then(() => router.push(`/ordered/${result.orderId}`)); 
    } else {
        throw new Error(result.message);
    }
  } catch (err) {
    Swal.fire("Error", "অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
  } finally {
    setLoading(false);
  }
};




  if (!orderData) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 md:py-20 px-4 mt-10">
      <div className="max-w-5xl mx-auto">
        
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-xs font-black text-gray-400 hover:text-black transition tracking-widest uppercase">
          <ArrowLeft size={16} /> Edit Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Shipping Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tighter mb-8 flex items-center gap-3">
              <MapPin className="text-orange-600" size={28} /> Shipping Details
            </h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-5">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="আপনার নাম লিখুন..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-900"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              {/* Mobile Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Active Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    required
                    type="tel" 
                    placeholder="মোবাইল নম্বর লিখুন..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-900"
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  />
                </div>
              </div>

              {/* Address Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Shipping Address</label>
                <textarea 
                  required
                  placeholder="আপনার পূর্ণ ঠিকানা (বাসা নং, রোড, এলাকা, জেলা) লিখুন..."
                  rows={3}
                  className="w-full p-5 bg-gray-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-900 resize-none"
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                ></textarea>
              </div>

              <div className="pt-4">
                <button 
                  disabled={loading}
                  className="w-full bg-gray-950 text-white py-5 rounded-2xl font-black 
                  text-sm uppercase tracking-[0.2em] hover:bg-orange-600 transition-all flex 
                  items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-gray-100"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <ShoppingBag size={20} />}
                  Confirm Order ({(orderData.totalAmount)} টাকা)
                </button>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-950 tracking-tight mb-6 uppercase">Order Summary</h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {orderData.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden border border-slate-50 flex-shrink-0">
                      <img src={item.imgUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-[12px] text-gray-900 truncate uppercase tracking-tighter">{item.title}</h4>
                      <p className="text-[11px] font-bold text-gray-500 uppercase">{item.quantity} পিস × {item.price} টাকা</p>
                    </div>
                    <p className="font-black text-sm text-gray-950">৳{item.quantity * item.price}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-slate-200 space-y-3">
                <div className="flex justify-between text-sm font-bold text-gray-400 uppercase">
                  <span>Subtotal</span>
                  <span className="text-gray-950">৳{orderData.totalAmount - 80}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-400 uppercase">
                  <span>Delivery Fee</span>
                  <span className="text-green-600">৳80</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                  <span className="text-sm font-black text-gray-950 uppercase">Total Amount</span>
                  <span className="text-2xl font-black text-orange-600 tracking-tighter">
                    ৳{orderData.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Safety Badge */}
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                <CreditCard size={18} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-orange-900 uppercase tracking-widest">Cash on Delivery</h4>
                <p className="text-[9px] font-bold text-orange-700/70 mt-0.5 uppercase">পণ্য বুঝে পেয়ে টাকা পরিশোধ করুন।</p>
              </div>
            </div> 
          </div>

        </div>
      </div>
    </div>
  );
}