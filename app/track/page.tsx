"use client";
import React, { useState } from "react";
import { Search, Loader2, Package, MapPin, Calendar, Clock, Truck, CheckCircle2 } from "lucide-react";

export default function PublicOrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      // Apnar API route jekhane Order ID diye data fetch kora jay
      const res = await fetch(`/api/order-status/${orderId.trim()}`);
      if (!res.ok) throw new Error("অর্ডার আইডিটি সঠিক নয় অথবা পাওয়া যায়নি।");
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    });
  };

  // Status mapping logic
  const steps = [
    { label: "Pending", bangla: "পেন্ডিং", icon: Clock, historyKey: "pendingAt", color: "text-amber-500", bg: "bg-amber-500" },
    { label: "Processing", bangla: "প্রসেসিং", icon: Loader2, historyKey: "processingAt", color: "text-blue-500", bg: "bg-blue-500" },
    { label: "Shipped", bangla: "শিপড", icon: Truck, historyKey: "shippedAt", color: "text-purple-500", bg: "bg-purple-500" },
    { label: "Delivered", bangla: "ডেলিভারড", icon: CheckCircle2, historyKey: "deliveredAt", color: "text-green-600", bg: "bg-green-600" }
  ];

  const currentStepIndex = order ? steps.findIndex(s => s.label === order.status) : -1;

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 mt-10">
      <div className="max-w-3xl mx-auto">
        
        {/* Search Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">অর্ডার ট্র্যাক করুন</h1>
          <p className="text-gray-500">আপনার অর্ডার আইডিটি দিয়ে বর্তমান অবস্থা জানুন</p>
          
          <form onSubmit={handleTrack} className="mt-8 flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="অর্ডার আইডি দিন (যেমন: Sbc-123...)" 
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <button 
              disabled={loading}
              className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Track"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4 font-bold text-sm">{error}</p>}
        </div>

        {/* Result UI */}
        {order && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Status Progress Vertical (Mobile Friendly) */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="space-y-8">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStepIndex;
                  const statusTime = order.statusHistory?.[step.historyKey];

                  return (
                    <div key={index} className="flex gap-4 relative">
                      {/* Vertical Line */}
                      {index !== steps.length - 1 && (
                        <div className={`absolute left-6 top-12 w-0.5 h-10 -z-0 ${index < currentStepIndex ? step.bg : "bg-gray-100"}`} />
                      )}
                      
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 border-4 border-white shadow-sm
                        ${isActive ? `${step.bg} text-white` : "bg-gray-100 text-gray-400"}`}>
                        <Icon size={20} className={index === currentStepIndex && step.label === "Processing" ? "animate-spin" : ""} />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className={`font-black uppercase tracking-wider text-sm ${isActive ? "text-gray-900" : "text-gray-300"}`}>
                            {step.bangla}
                          </h3>
                          {statusTime && (
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                              {formatDateTime(statusTime)}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-1 ${isActive ? "text-gray-500" : "text-gray-200"}`}>
                          {isActive ? "কাজ সম্পন্ন হয়েছে বা হচ্ছে" : "অপেক্ষা করুন"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simple Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-[15px] uppercase font-black text-gray-400">নাম</p>
                  <p className="font-bold text-gray-900 capitalize">{order.name}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-[15px] uppercase font-black text-gray-400">অর্ডারের দাম</p>
                  <p className="font-bold text-gray-900">৳{order.totalAmount}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[15px] uppercase font-black text-gray-400">শিপিং ঠিকানা</p>
                  <p className="font-bold text-gray-900 truncate max-w-[200px]">{order.shippingAddress}</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}