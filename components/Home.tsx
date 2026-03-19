"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiPrinter, FiAward, FiUserCheck, FiLayers, FiCheckCircle, FiInfo } from 'react-icons/fi';

const productImages = [
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400",
  "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=400",
  "https://images.unsplash.com/photo-1521109464564-2fa2faa95858?w=400",
  "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400",
];

export default function Home() {
  return (
    <div className="bg-white
     text-slate-900 px-4 py-12 mt-10 md:px-10">
      
      {/* Header Section */}
      <header className="max-w-5xl mb-5">
        <h1 className="text-3xl md:text-5xl
         font-bold leading-tight border-l-8 border-blue-600 pl-5 mb-4 uppercase">
          উন্নত সেবায় আমরা অঙ্গীকারবদ্ধ, <br/> মানোন্নয়নে সর্বদা সচেতন।
        </h1>
        <p className="text-lg text-slate-500 font-medium">উন্নতমানের প্রিন্টিং আর দীর্ঘস্থায়ী নিশ্চয়তা।</p>
      </header>

      {/* Infinite Seamless Scrolling - JS based for Smooth Loop */}
      <div className="relative overflow-hidden 
      py-8 border-y border-slate-100 mb-10">
        <motion.div 
          className="flex gap-6 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
        >
          {/* Double the array for seamless looping */}
          {[...productImages, ...productImages].map((img, i) => (
            <div key={i} className="w-72 h-44 flex-shrink-0 border border-slate-200 p-1">
               <img src={img} className="w-full rounded-lg h-full object-cover" alt="Product Showcase" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-6xl grid md:grid-cols-2 
      gap-16 mb-20">
        {/* Services List */}
        <div className="space-y-8">
          <h2 className="text-2xl border-l-4 pl-4 border-green-500 font-bold uppercase tracking-tight flex items-center gap-3">
             আমাদের সেবাসমূহ
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <FiUserCheck />, text: "প্রিভিসি আইডি কার্ড" },
              { icon: <FiLayers />, text: "গেঞ্জি ও ক্যাপ প্রিন্ট" },
              { icon: <FiPrinter />, text: "মগ প্রিন্ট" },
              { icon: <FiAward />, text: "ক্রেস্ট প্রিন্ট" }
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 p-4 border border-slate-100 hover:border-blue-500 transition-colors">
                <span className="text-blue-600 text-xl">{item.icon}</span>
                <span className="font-bold">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Why Us Section */}
        <div className="bg-slate-50 p-8 border border-slate-200">
          <h2 className="text-2xl font-bold mb-5 inline-block border-b-2 border-blue-600 pb-1">কেন আমাদেরকে বেছে নেবেন?</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            আমরা দিচ্ছি উন্নতমানের প্রিন্টিং কোয়ালিটি আর সেবার মানের ১০০% নিশ্চয়তা। আপনার প্রয়োজনের প্রতি খেয়াল রেখেই আমাদের এগিয়ে চলা।
          </p>
          <div className="grid grid-cols-1 gap-3">
             <div className="flex items-center gap-2 text-sm font-bold bg-white p-3 shadow-sm border-l-4 border-green-500">
               <FiCheckCircle className="text-green-500" /> ১০০% প্রিন্টিং কোয়ালিটি নিশ্চিত
             </div>
             <div className="flex items-center gap-2 text-sm font-bold bg-white p-3 shadow-sm border-l-4 border-green-500">
               <FiCheckCircle className="text-green-500" /> দীর্ঘস্থায়ী কালার গ্যারান্টি
             </div>
          </div>
        </div>
      </div>

      {/* Stylish Example Product Grid */}
      <div className="max-w-6xl">
        <h2 className="text-2xl font-bold mb-8 uppercase italic border-b border-slate-900 pb-2 inline-block">Product Showcase</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productImages.map((img, i) => (
            <div key={i} className="group rounded-lg
             relative overflow-hidden   p-2 hover:border-blue-600 transition-all">
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <img 
                  src={img} 
                  className="w-full rounded-lg h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt="Product" 
                />
                {/* Overlay Effect */}
                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="pt-4 pb-2">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Printing Item</p>
                <h3 className="text-lg font-bold">Premium Quality {i + 1}</h3>
                <div className="mt-3 flex justify-between items-center border-t border-slate-50 pt-3">
                  <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-1">NEW ARRIVAL</span>
                  <FiInfo className="text-slate-300 group-hover:text-blue-600 cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
      
      
          <div className="w-full max-w-3xl
          mt-16
           border-t-2 border-green-500">
        
        <div className="shadow-lg rounded-xl overflow-hidden">
            <iframe 
                className="w-full aspect-video" 
                src="https://www.youtube.com/embed/ZkUpk4lWPj8" 
                title="স্বাগতম বিজনেস সেন্টার" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen>
            </iframe>
        </div>
    </div>
      
      

    </div>
  );
}
