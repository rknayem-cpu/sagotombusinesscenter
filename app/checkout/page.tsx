"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, CreditCard, Loader2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

export default function CheckoutPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '', address: '' });

  useEffect(() => {
    // LocalStorage থেকে কার্ট ডাটা চেক করা
    const savedData = localStorage.getItem('pendingOrder');
    if (!savedData) {
      router.push('/cart');
    } else {
      setOrderData(JSON.parse(savedData));
    }
  }, [router]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    
    e.preventDefault();
    
    if (!formData.mobile || !formData.address) {
      return Swal.fire("Required", "Please provide mobile number and address", "warning");
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderData.items,
          totalAmount: orderData.totalAmount,
          customerInfo: formData
        })
      });

      const result = await res.json();

      if (result.success) {
        localStorage.removeItem('pendingOrder'); // অর্ডার সাকসেস হলে ডাটা রিমুভ
        window.dispatchEvent(new Event('cartUpdated')); // কার্ট আইকন আপডেট করার জন্য
        
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your order has been received.',
          confirmButtonColor: '#ea580c'
        }).then(() => router.push(`/ordered/${result.orderId}`)); // অর্ডার লিস্টে পাঠিয়ে দেওয়া
      }
    } catch (err) {
      Swal.fire("Error", "Failed to place order. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-gray-50/50 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-xs font-black text-gray-400 hover:text-black transition tracking-widest uppercase">
          <ArrowLeft size={16} /> Edit Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Shipping Form (7 Columns) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h2 className="text-3xl font-black text-gray-950 tracking-tighter mb-8 flex items-center gap-3">
              <MapPin className="text-orange-600" size={28} /> Delivery Info
            </h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-6">

<div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Active Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="নাম লিখুন..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-900"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

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

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Shipping Address</label>
                <textarea 
                  required
                  placeholder="ঠিকানা লিখুন..."
                  rows={4}
                  className="w-full p-5 bg-gray-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-900 resize-none"
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                ></textarea>
              </div>

              <div className="pt-4">
                <button 
                  disabled={loading}
                  className="w-full bg-gray-950 text-white py-5 rounded-2xl font-black 
                  text-sm uppercase tracking-[0.2em] hover:bg-orange-600 transition-all flex 
                  items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-gray-200"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <ShoppingBag size={20} />}
                  Confirm Order ({(orderData.totalAmount)} টাকা)
                </button>
              </div>
            </form>
          </div>

          {/* Right: Order Summary (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-950 tracking-tight mb-6">অর্ডার সামারি</h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {orderData.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden border border-slate-50 flex-shrink-0">
                      <img src={item.imgUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-sm text-gray-900 truncate uppercase tracking-tighter">{item.title}</h4>
                      <p className="text-[13px] font-bold text-gray-500 uppercase">{item.quantity} পিস × {item.price} টাকা</p>
                    </div>
                    <p className="font-black text-md text-gray-950">{(item.quantity * item.price)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-slate-200 space-y-3">
                <div className="flex justify-between text-md font-bold text-gray-400 uppercase">
                  <span>সর্বমোট দাম</span>
                  <span className="text-gray-950">{(orderData.totalAmount - 80)} টাকা</span>
                </div>
                <div className="flex justify-between text-md font-bold text-gray-400 uppercase">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-green-600 tracking-widest">80 টাকা</span>
                </div>
                <div className="flex justify-between items-end pt-2 border-t border-slate-200">
                  <span className="text-md font-black text-gray-950 uppercase">সর্বমোট দাম</span>
                  <span className="text-3xl font-black text-orange-600 tracking-tighter relative top-2">
                    {orderData.totalAmount} <span className='relative top-1'>টাকা</span></span>
                </div>
              </div>
            </div>

            {/* Safety Badge */}
            <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-orange-200">
                <CreditCard size={20} />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-orange-900 uppercase tracking-widest leading-none">Cash on Delivery</h4>
                <p className="text-[10px] font-bold text-orange-700/70 mt-1 uppercase leading-tight">Pay only when you receive your package.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}