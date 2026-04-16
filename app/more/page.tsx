"use client";
import React from "react";
import { FaWhatsapp } from "react-icons/fa6";

import { 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  HelpCircle, 
  Info,
  ChevronRight
} from "lucide-react";

export default function InfoPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 mt-16">
      {/* Hero Section */}
      <div className="bg-blue-700 py-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">আমাদের সেবা ও নির্দেশিকা</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg">
          সঠিক নিয়মে অর্ডার করুন এবং আমাদের সেবা উপভোগ করুন।
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10">
        
        {/* ১. কি কি বিক্রি হয় (Products Category) */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <ShoppingBag size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">আমাদের পণ্যসমূহ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["প্রিন্টিং মগ", "পিভিসি আইডি কার্ড", "প্রিন্টিং গেঞ্জি", "ক্রেস্ট"].map((item, i) => (
                <div key={i} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                  <ChevronRight className="text-blue-500 mr-2 group-hover:translate-x-1 transition-transform" size={20} />
                  <span className="font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ২. কিভাবে অর্ডার করবেন (Order Process) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">কিভাবে অর্ডার করবেন?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <ShoppingBag />, title: "পণ্য বাছাই", desc: "আপনার পছন্দের পণ্যটি কার্টে যোগ করুন।" },
              { icon: <Info />, title: "তথ্য প্রদান", desc: "দাম দেখে চেকআউট করে সঠিক নাম, ঠিকানা ও মোবাইল নম্বর দিন। এরপর অর্ডার করুন" },
              { icon: <FaWhatsapp size={24} />, title: "হোয়াটসআপে মেসেজ", desc: "অর্ডার করা শেষ হলে হোয়াটসআপে মেসেজ দিয়ে আপনার ডিজাইন দিন" },
              { icon: <CreditCard />, title: "পেমেন্ট", desc: "বিকাশ বা নগদে অগ্রীম পেমেন্ট সম্পন্ন করুন। (৫০%)" },
              { icon: <Truck />, title: "ডেলিভারি", desc: "২৪-৪৮ ঘণ্টার মধ্যে পণ্য পৌঁছে যাবে আপনার হাতে।" },
            ].map((step, index) => (
              <div key={index} className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                  {step.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                {index !== 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300">
                    <ChevronRight size={30} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ৩. নিয়মাবলী (Rules & Terms) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* অর্ডার নীতি */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 text-green-600">
              <ShieldCheck size={24} />
              <h2 className="text-xl font-bold">অর্ডারের নিয়মাবলী</h2>
            </div>
            <ul className="space-y-4 text-gray-600">
               <li className="flex gap-2">🔹 অর্ডার করার পরে ওয়েবসাইটের ডান পাশের ওয়াটসআপ আইকনে ক্লিক করে 
                
                আমাদের সাথে যোগাযোগ করে আপনার ডিজাইনের তথ্য দিন</li>
              <li className="flex gap-2">🔹 অর্ডারের পরে নূন্যতম ৫০% অগ্রীম প্রদান করতে হবে।</li>
              <li className="flex gap-2">🔹 ভুল তথ্য দিলে অর্ডার বাতিল বলে গণ্য হতে পারে।</li>
              <li className="flex gap-2">🔹 কোনো পণ্য স্টকে না থাকলে আমরা ১২ ঘণ্টার মধ্যে জানাব।</li>
            </ul>
          </div>

          {/* সাহায্য */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 text-orange-500">
              <HelpCircle size={24} />
              <h2 className="text-xl font-bold">সহায়তা প্রয়োজন?</h2>
            </div>
            <p className="text-gray-600 mb-6">
              আপনার যদি কোনো প্রশ্ন থাকে বা বুঝতে সমস্যা হয়, সরাসরি আমাদের সাপোর্ট টিমে যোগাযোগ করুন।
            </p>
            <a href='tel:01997219858' className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-all">
              যোগাযোগ করুন
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}