"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Truck, Home, Loader2, LucideIcon, Clock } from "lucide-react";

// ১. Interface আপডেট (statusHistory যুক্ত করা হয়েছে)
interface OrderData {
  name?: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  isPaid: boolean;
  shippingAddress?: string;
  user?: {
    name?: string;
  };
  statusHistory?: {
    pendingAt?: string;
    processingAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
}

interface Step {
  label: string;
  bangla: string;
  desc: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  historyKey: keyof NonNullable<OrderData["statusHistory"]>; // টাইমস্ট্যাম্প কি
}

const OrderStatus = () => {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // ২. steps অ্যারেতে historyKey যুক্ত করা হয়েছে
  const steps: Step[] = [
    { 
      label: "Pending", 
      bangla: "পেন্ডিং", 
      desc: "অর্ডারটি গ্রহণ করা হয়েছে", 
      icon: Clock,
      colorClass: "text-amber-500", 
      bgClass: "bg-amber-500",
      borderClass: "border-amber-200",
      historyKey: "pendingAt"
    },
    { 
      label: "Processing", 
      bangla: "প্রসেসিং", 
      desc: "অর্ডারটি প্রস্তুত করা হচ্ছে", 
      icon: Loader2,
      colorClass: "text-blue-500", 
      bgClass: "bg-blue-500",
      borderClass: "border-blue-200",
      historyKey: "processingAt"
    },
    { 
      label: "Shipped", 
      bangla: "শিপড", 
      desc: "অর্ডারটি আপনার কাছে যাওয়ার পথে", 
      icon: Truck,
      colorClass: "text-purple-500", 
      bgClass: "bg-purple-500",
      borderClass: "border-purple-200",
      historyKey: "shippedAt"
    },
    { 
      label: "Delivered", 
      bangla: "ডেলিভারড", 
      desc: "সফলভাবে ডেলিভারি করা হয়েছে", 
      icon: CheckCircle2,
      colorClass: "text-green-600", 
      bgClass: "bg-green-600",
      borderClass: "border-green-200",
      historyKey: "deliveredAt"
    }
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/order-status/${id}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // ৩. টাইম ফরম্যাট করার ফাংশন
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      <p className="text-gray-500 font-medium">অর্ডার তথ্য লোড হচ্ছে...</p>
    </div>
  );

  if (error || !order) return <div className="p-10 text-center text-red-500 font-bold">অর্ডারটি খুঁজে পাওয়া যায়নি!</div>;

  const currentStepIndex = steps.findIndex(s => s.label === order.status);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-2xl rounded-2xl my-10 mt-24 border border-gray-100">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">অর্ডার ট্র্যাকিং</h2>
        <p className="text-gray-500 mt-2">অর্ডার আইডি: <span className="font-mono text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">{id}</span></p>
      </div>

      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0 mb-20">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const statusTime = order.statusHistory?.[step.historyKey]; // টাইম বের করা

          return (
            <div key={step.label} className="flex flex-row md:flex-col items-center z-10 w-full md:w-1/4">
              <div className={`w-14 h-14 flex items-center justify-center rounded-full border-4 transition-all duration-700 
                ${isActive ? `${step.bgClass} ${step.borderClass} text-white shadow-lg` : "bg-gray-100 border-gray-50 text-gray-400"}`}>
                <Icon size={26} className={isCurrent && step.label === "Processing" ? "animate-spin" : ""} />
              </div>
              
              <div className="ml-5 md:ml-0 md:mt-4 md:text-center">
                <p className={`font-bold text-lg transition-colors duration-500 ${isActive ? step.colorClass : "text-gray-400"}`}>
                  {step.bangla}
                </p>
                {/* টাইম প্রদর্শন */}
                {statusTime && (
                  <p className="text-[11px] font-bold text-gray-500 mt-1 bg-gray-50 px-2 py-0.5 rounded-full inline-block">
                    {formatDateTime(statusTime)}
                  </p>
                )}
                <p className="text-[12px] text-gray-400 mt-1 max-w-[140px] leading-tight font-medium">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}

        {/* Desktop Progress Line */}
        <div className="hidden md:block absolute top-7 left-0 w-full h-1 bg-gray-100 -z-0 rounded-full">
          <div 
            className="h-full transition-all duration-1000 ease-in-out rounded-full" 
            style={{ 
              width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
              backgroundColor: currentStepIndex >= 0 ? steps[currentStepIndex].colorClass.replace('text-', '').split('-')[0] : '#f3f4f6' 
            }}
          ></div>
        </div>
      </div>

      {/* Summary Card (আগের মতোই) */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h3 className="text-xl font-bold mb-5 text-gray-700 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          অর্ডার সারসংক্ষেপ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-200 md:border-none">
            <span className="text-gray-500 font-medium">ক্রেতার নাম</span>
            <span className="font-semibold text-gray-800">{order.user?.name || "গেস্ট ইউজার"}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200 md:border-none">
            <span className="text-gray-500 font-medium">মোট পরিমাণ</span>
            <span className="font-bold text-gray-900 text-xl">৳{order.totalAmount}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200 md:border-none">
            <span className="text-gray-500 font-medium">পেমেন্ট পদ্ধতি</span>
            <span className="font-bold text-indigo-600 uppercase text-sm tracking-wider">{order.paymentStatus}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500 font-medium">পেমেন্ট স্ট্যাটাস</span>
            <span className={`px-4 py-1 rounded-full text-xs font-black tracking-wide uppercase ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {order.isPaid ? "PAID" : "UNPAID"}
            </span>
          </div>
          <div className="col-span-1 md:col-span-2 mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <span className="text-gray-400 text-xs font-bold uppercase block mb-1">শিপিং ঠিকানা</span>
            <span className="text-gray-700 font-medium leading-relaxed">
              {order.shippingAddress || "ঠিকানা প্রদান করা হয়নি"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;