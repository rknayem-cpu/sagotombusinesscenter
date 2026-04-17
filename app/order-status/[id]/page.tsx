"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Package, Truck, Home, Loader2 } from "lucide-react";

const OrderStatus = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status, Icons ebong Description er mapping
  const steps = [
    { 
      label: "Pending", 
      bangla: "পেন্ডিং", 
      desc: "অর্ডারটি গ্রহণ করা হয়েছে", 
      icon: CheckCircle2 
    },
    { 
      label: "Processing", 
      bangla: "প্রসেসিং", 
      desc: "অর্ডারটি প্রস্তুত করা হচ্ছে", 
      icon: Loader2 
    },
    { 
      label: "Shipped", 
      bangla: "শিপড", 
      desc: "অর্ডারটি আপনার কাছে যাওয়ার জন্য প্রস্তুত", 
      icon: Truck 
    },
    { 
      label: "Delivered", 
      bangla: "ডেলিভারড", 
      desc: "অর্ডারটি কুরিয়ার ম্যানের কাছে দেওয়া হয়েছে, দ্রুতই পাবেন", 
      icon: Home 
    }
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order-status/${id}`);
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500">অর্ডার তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!order) return <div className="p-10 text-center text-red-500">অর্ডারটি খুঁজে পাওয়া যায়নি!</div>;

  // Database er status er sathe index match kora
  const currentStepIndex = steps.findIndex(s => s.label === order.status);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-2xl rounded-2xl my-10 mt-24 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">অর্ডার স্ট্যাটাস</h2>
        <p className="text-gray-500 mt-2">অর্ডার আইডি: <span className="font-mono text-blue-600 font-bold">{id}</span></p>
      </div>

      {/* Progress Bar Visual */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0 mb-16">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <div key={step.label} className="flex flex-row md:flex-col items-center z-10 w-full md:w-1/4 group">
              {/* Icon Circle */}
              <div className={`w-14 h-14 flex items-center justify-center rounded-full border-4 transition-all duration-500 
                ${isActive ? "bg-green-500 border-green-200 text-white" : "bg-gray-100 border-gray-50 text-gray-400"}`}>
                <Icon size={24} className={index === 1 && isActive ? "animate-spin" : ""} />
              </div>
              
              {/* Text Content */}
              <div className="ml-4 md:ml-0 md:mt-4 md:text-center">
                <p className={`font-bold text-lg ${isActive ? "text-green-600" : "text-gray-400"}`}>
                  {step.bangla}
                </p>
                <p className="text-xs text-gray-500 mt-1 max-w-[150px] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}

        {/* Desktop Connector Line */}
        <div className="hidden md:block absolute top-7 left-0 w-full h-1 bg-gray-100 -z-0">
          <div 
            className="h-full bg-green-500 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">অর্ডার সারসংক্ষেপ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between p-2 border-b md:border-none">
            <span className="text-gray-500">ক্রেতার নাম:</span>
            <span className="font-semibold text-gray-800">{order.user?.name || "গেস্ট ইউজার"}</span>
          </div>
          <div className="flex justify-between p-2 border-b md:border-none">
            <span className="text-gray-500">মোট টাকা:</span>
            <span className="font-semibold text-gray-800 text-xl">৳{order.totalAmount}</span>
          </div>
          <div className="flex justify-between p-2 border-b md:border-none">
            <span className="text-gray-500">পেমেন্ট পদ্ধতি:</span>
            <span className="font-semibold text-blue-600 uppercase italic">{order.paymentStatus}</span>
          </div>
          <div className="flex justify-between p-2">
            <span className="text-gray-500">পেমেন্ট স্ট্যাটাস:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {order.isPaid ? "পেইড (Paid)" : "আনপেইড (Unpaid)"}
            </span>
          </div>

<div className="flex justify-between p-2 border-b md:border-none col-span-1 md:col-span-2">
      <span className="text-gray-500 min-w-[120px]">শিপিং ঠিকানা:</span>
      <span className="font-medium text-gray-800 text-right">
        {order.shippingAddress ? (
          <>
            {order.shippingAddress}
                      </>
        ) : (
          "ঠিকানা পাওয়া যায়নি"
        )}
      </span>
    </div>

      
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;