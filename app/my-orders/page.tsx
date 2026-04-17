"use client";

import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/my-orders?t=${Date.now()}`, {
        cache: 'no-store'
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Loading Your Orders...</p>
    </div>
  );

  // অর্ডারের লিস্ট বের করে নেওয়া (নিশ্চিত হয়ে যে এটি অ্যারে)
  const orderList = user?.orders || [];
return (
  <div className="min-h-screen bg-white py-12 px-4 md:px-10 mt-10">
    <div className="max-w-[1200px] mx-auto text-slate-900">
      <h1 className="text-3xl font-black mb-10 uppercase tracking-tighter italic">
        My <span className="text-blue-600">Orders</span>
      </h1>

      {orderList.length === 0 ? (
        <div className="py-20 text-center border-2 border-slate-100 rounded-[2.5rem] text-slate-300 font-black uppercase tracking-[0.2em]">
          No orders yet
        </div>
      ) : (
        /* PC: 3 Columns, Mobile: 1 Column Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orderList.map((order: any) => (
            typeof order === 'object' && (
              <div key={order._id} className="border-2 border-slate-100 rounded-[2rem] p-6 flex flex-col hover:border-blue-600 transition-all duration-300 bg-white group">
                <div onClick={()=>router.push(`/order-status/${order._id}`)} className='relative bottom-3 text-blue-500 
                hover:underline active:underline cursor-pointer'>অর্ডারের অবস্থা দেখুন</div>
                {/* Header: ID & Status */}
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-slate-50 px-3 py-1 rounded-lg">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID</p>
                    <p className="font-bold text-xs">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
             <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border ${
    order.status?.toLowerCase() === 'pending' 
      ? 'text-orange-600 bg-orange-50 border-orange-100' 
      : order.status?.toLowerCase() === 'shipped' 
      ? 'text-blue-600 bg-blue-50 border-blue-100' 
      : order.status?.toLowerCase() === 'delivered' 
      ? 'text-green-600 bg-green-50 border-green-100' 
      : 'text-slate-600 bg-slate-50 border-slate-100' // অন্য কোনো স্ট্যাটাস হলে এই কালার পাবে
  }`}>
    {order.status}
</span>
                </div>

                {/* Items Section with Scroll (Max 3 items visible) */}
                <div className="flex-1 overflow-y-auto pr-2 mb-6 max-h-[220px] custom-scrollbar space-y-3">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50/50 p-2 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                      <img 
                        src={item.imgUrl} 
                        className="h-20 w-20 object-cover rounded-xl border border-white shadow-sm flex-shrink-0" 
                        alt="" 
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[16px] font-black text-slate-800 truncate uppercase leading-tight mb-1">{item.title}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-[15px] font-bold text-slate-500">
                            {item.quantity} পিস <span className="text-[9px] mx-0.5">×</span> ৳{item.price}
                          </p>
                          <p className="text-[16px] font-black text-blue-600">
                            ৳{item.quantity * item.price} টাকা
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer: Price & Address */}
                <div className="pt-5 border-t-2 border-dashed border-slate-100 flex justify-between items-end mt-auto">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="text-[14px] font-black text-slate-400 uppercase mb-1">ডেলিভারির ঠিকানা</p>
                    <p className="text-[13px] text-slate-600 font-bold truncate">
                      {order.shippingAddress || "Not set"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[14px] font-black text-slate-400 uppercase">সর্বমোট দামঃ</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">৳{order.totalAmount}</p>
                  </div>
                </div>

              </div>
            )
          ))}
        </div>
      )}
    </div>

    {/* Custom Scrollbar Style */}
    <style jsx>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #3b82f6;
      }
    `}</style>
  </div>
);
}