"use client";
import React, { useEffect, useState } from 'react';
import * as fbq from '@/lib/fpixel';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Phone, CreditCard, Loader2, ShoppingBag, ArrowLeft, User, Plus, Minus } from 'lucide-react';
import Swal from 'sweetalert2';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDirect = searchParams.get('source') === 'direct';
  
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '', address: '' });

  // --- ১. ডাটা লোড করা ---
  useEffect(() => {
    let savedData;
    
    if (isDirect) {
      const directItem = localStorage.getItem('direct_checkout');
      if (directItem) {
        const item = JSON.parse(directItem);
        savedData = {
          items: [item],
          totalAmount: (item.price * item.quantity) + 80
        };
      }
    } else {
      const pendingData = localStorage.getItem('pendingOrder');
      if (pendingData) savedData = JSON.parse(pendingData);
    }

    if (!savedData) {
      router.push('/cart');
    } else {
      setOrderData(savedData);
      
      fbq.event('InitiateCheckout', {
        content_ids: savedData.items.map((item: any) => item._id || item.id),
        content_type: 'product',
        value: savedData.totalAmount,
        currency: 'BDT',
        num_items: savedData.items.length
      });
    }
  }, [router, isDirect]);

  // --- ২. ডিরেক্ট অর্ডারের জন্য কোয়ান্টিটি কন্ট্রোল ---
  const updateDirectQty = (type: 'inc' | 'dec') => {
    if (!isDirect || !orderData) return;

    const currentItem = orderData.items[0];
    let newQty = type === 'inc' ? currentItem.quantity + 1 : currentItem.quantity - 1;
    
    if (newQty < 1) return;

    const updatedItem = { ...currentItem, quantity: newQty };
    const newTotal = (updatedItem.price * newQty) + 80;
    
    setOrderData({
      items: [updatedItem],
      totalAmount: newTotal
    });

    localStorage.setItem('direct_checkout', JSON.stringify(updatedItem));
  };

  // --- ৩. অর্ডার প্লেস করা ---
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.address) {
      return Swal.fire("Missing Info", "সবগুলো ঘর পূরণ করুন", "warning");
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
        fbq.event('Purchase', {
          value: orderData.totalAmount,
          currency: 'BDT',
          content_type: 'product',
          content_ids: orderData.items.map((item: any) => item._id || item.id),
          num_items: orderData.items.length,
        });

        localStorage.removeItem(isDirect ? 'direct_checkout' : 'pendingOrder');
        if (!isDirect) localStorage.removeItem('cart');
        
        window.dispatchEvent(new Event('cartUpdated')); 
        
        Swal.fire({
          icon: 'success',
          title: 'অর্ডার সফল হয়েছে!',
          text: 'ধন্যবাদ, আপনার অর্ডারটি গ্রহণ করা হয়েছে।',
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
          <ArrowLeft size={16} /> Back
        </button>
<div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 text-md rounded">
  অর্ডার করার নিয়মাবলীঃ 
অর্ডার করা শেষ হলে ওয়েবসাইটের ডানপাশের হোয়াটসআপ বাটনে ক্লিক করে আমাদের হোয়াটসআপে আপনার ডিজাইনটা দিবেন,
এনআইডি কার্ড বা ড্রাইভিং লাইসেন্স এর ক্ষেত্রে 
পিডিএফ দিবেন,  পিডিএফ দিলে সবচেয়ে ভাল হবে। 
পিডিএফ না থাকলে পরিষ্কার ছবি তুলে দিবেন।
তারপর ডিজাইন পাওয়ার পর আমরা আপনার পন্যটি প্রিন্ট করে পাঠাবো।
গেনজি বা ক্রেস্ট অর্ডারের ক্ষেত্রেও  একইভাবে অর্ডার করা শেষ হলে 
ওয়েবসাইটের ডানপাশের হোয়াটসআপ বাটনে ক্লিক করে আমাদের হোয়াটসআপে আপনার ডিজাইনটা দিবেন। 
</div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Shipping Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tighter mb-8 flex items-center gap-3">
              <MapPin className="text-orange-600" size={28} /> Shipping Details
            </h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required type="text" placeholder="আপনার নাম..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-900" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required type="tel" placeholder="01XXXXXXXX" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-900" onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Address</label>
                <textarea required placeholder="ঠিকানা লিখুন..." rows={3} className="w-full p-5 bg-gray-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-900 resize-none" onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
              </div>

              <div className="pt-4">
                <button disabled={loading}
                 type='submit'

                  aria-label="Confirm Order" // Meta/FB robot-er jonno khub important
                  title="Confirm Order"
                className="w-full bg-gray-950 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-gray-100">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <ShoppingBag size={20} />}
                  Confirm Order (৳{orderData.totalAmount})
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-950 tracking-tight mb-6 uppercase">Summary</h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {orderData.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden border border-slate-50 flex-shrink-0">
                      <img src={item.imgUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-[12px] text-gray-900 truncate uppercase tracking-tighter">{item.title}</h4>
                      
                      {isDirect ? (
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateDirectQty('dec')} className="w-6 h-6 flex items-center justify-center border rounded-md hover:bg-gray-100"><Minus size={12}/></button>
                          <span className="text-[12px] font-black">{item.quantity}</span>
                          <button onClick={() => updateDirectQty('inc')} className="w-6 h-6 flex items-center justify-center border rounded-md hover:bg-gray-100"><Plus size={12}/></button>
                        </div>
                      ) : (
                        <p className="text-[11px] font-bold text-gray-500 uppercase">{item.quantity} পিস × {item.price} টাকা</p>
                      )}
                    </div>
                    <p className="font-black text-sm text-gray-950">৳{item.quantity * item.price}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-slate-200 space-y-3 text-sm font-bold uppercase">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-950">৳{orderData.totalAmount - 80}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery</span>
                  <span className="text-green-600">৳80</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                  <span className="text-sm font-black text-gray-950">Total</span>
                  <span className="text-2xl font-black text-orange-600 tracking-tighter">৳{orderData.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                <CreditCard size={18} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-orange-900 uppercase">Cash on Delivery</h4>
                <p className="text-[9px] font-bold text-orange-700/70 mt-0.5">পণ্য বুঝে পেয়ে টাকা দিন।</p>
              </div>
            </div> 
          </div>

        </div>
      </div>
    </div>
  );
}