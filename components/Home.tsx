"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiPrinter, FiAward, FiUserCheck, FiLayers, FiCheckCircle, FiArrowRight } from 'react-icons/fi';




const productImages = [
"https://www.photoland.in/wp-content/uploads/2025/05/School-ID-Card-Vertical_Design-2_c-768x768.jpg",
"https://images.graphicbangla.com/images/2025/07/30/688a43b9330851753891769.jpeg",
"https://shorifart.com/wp-content/uploads/2024/06/18-1-scaled.jpg",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRccj3CORY3LDfGbTEL4zLo2XIXEq2Z71PRJ_uwJtaX7MmiqpgCoaReKsI&s=10"
]







const services = [
  { icon: <FiUserCheck />, text: "প্রিভিসি আইডি কার্ড" },
  { icon: <FiLayers />, text: "গেঞ্জি ও ক্যাপ প্রিন্ট" },
  { icon: <FiPrinter />, text: "মগ প্রিন্ট" },
  { icon: <FiAward />, text: "ক্রেস্ট প্রিন্ট" }
];

export default function Home() {
  return (
    <div className="bg-white text-slate-900 px-4
     py-8 md:px-10 mt-16">
      
      {/* Header Section */}
      <header className="max-w-5xl mb-4">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight border-l-8 border-blue-600 pl-5 mb-4 uppercase">
          উন্নত সেবায় আমরা অঙ্গীকারবদ্ধ, <br /> মানোন্নয়নে সর্বদা সচেতন।
        </h1>
        <p className="text-lg text-slate-500 font-medium">উন্নতমানের প্রিন্টিং আর দীর্ঘস্থায়ী নিশ্চয়তা।</p>
      </header>

      {/* Infinite Seamless Scrolling */}
      <div className="relative overflow-hidden py-6 border-y border-slate-100 mb-12">
        <motion.div
          className="flex gap-6 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
        >
          {[...productImages, ...productImages].map((img, i) => (
            <div key={i} className="w-72 h-44 flex-shrink-0 border rounded-lg border-slate-200 p-1">
              <img src={img} className="w-full rounded-lg h-full object-cover" alt={`Product ${i}`} />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-6xl grid md:grid-cols-2 gap-12 mb-16">
        {/* Services List */}
        <div className="space-y-6">
          <h2 className="text-2xl border-l-4 pl-4 border-green-500 font-bold uppercase tracking-tight">
            আমাদের সেবাসমূহ
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((item, index) => (
              <li key={index} className="flex items-center gap-3 p-4 border border-slate-100 hover:border-blue-500 transition-colors bg-slate-50/30">
                <span className="text-blue-600 text-xl">{item.icon}</span>
                <span className="font-bold">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Why Us Section */}
        <div className="bg-slate-50 p-8 border border-slate-200 rounded-sm">
          <h2 className="text-2xl font-bold mb-4 inline-block border-b-2 border-blue-600 pb-1">কেন আমাদেরকে বেছে নেবেন?</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            আমরা দিচ্ছি উন্নতমানের প্রিন্টিং কোয়ালিটি আর সেবার মানের ১০০% নিশ্চয়তা। আপনার প্রয়োজনের প্রতি খেয়াল রেখেই আমাদের এগিয়ে চলা।
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-2 text-sm font-bold bg-white p-3 shadow-sm border-l-4 border-green-500">
              <FiCheckCircle className="text-green-500" /> ১০০% প্রিন্টিং কোয়ালিটি নিশ্চিত
            </div>
            <div className="flex items-center gap-2 text-sm font-bold bg-white p-3 shadow-sm border-l-4 border-green-500">
              <FiCheckCircle className="text-green-500" /> দীর্ঘস্থায়ী কালার গ্যারান্টি
            </div>
          </div>
        </div>
      </div>

      {/* Product Showcase */}
      <div className="max-w-6xl mb-16">
        <div className="flex justify-between items-end mb-8 border-b border-slate-900 pb-2">
          <h2 className="text-2xl font-bold uppercase italic">Product Showcase</h2>
          <Link href="/seemore" className="text-blue-600 font-bold flex items-center gap-1 hover:underline text-sm mb-1">
            See More Samples <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {productImages.map((img, i) => (
            <div key={i} className="group relative overflow-hidden transition-all">
              <div className="relative h-60 w-full overflow-hidden bg-slate-100 rounded-lg">
                <img
                  src={img}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={`Showcase item ${i + 1}`}
                />
                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="pt-4">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Printing Item</p>
                <h3 className="text-lg font-bold">Premium Quality {i + 1}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Section */}
      <div className="w-full max-w-4xl mx-auto border-t-2 border-green-500 pt-12 mb-16">
        <div className="shadow-2xl rounded-xl overflow-hidden bg-black">
          <iframe
            className="w-full aspect-video"
            src="https://www.youtube.com/embed/ZkUpk4lWPj8"
            title="স্বাগতম বিজনেস সেন্টার"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Status Counter Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 py-10 text-black border-t border-slate-100">
        {[
          { label: "হ্যাপি ক্লায়েন্ট", value: "৫০০+", icon: <FiUserCheck className="text-green-500" /> },
          { label: "আইডি কার্ড ডেলিভারি", value: "১০০০+", icon: <FiLayers className="text-blue-500" /> },
          { label: "প্রিন্টিং আইটেম", value: "৫০+", icon: <FiPrinter className="text-purple-500" /> },
          { label: "সফল বছর", value: "১০+", icon: <FiAward className="text-yellow-500" /> }
        ].map((stat, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-2">
            <div className="text-4xl mb-2">{stat.icon}</div>
            <h4 className="text-3xl md:text-4xl font-black tracking-tighter">{stat.value}</h4>
            <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
