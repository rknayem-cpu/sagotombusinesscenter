"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiTag, FiMaximize2, FiEdit3, FiPlusCircle } from 'react-icons/fi';

export default function ProductPostForm() {
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    category: 'printing',
    bio: ''
  });

  const categories = [
    { id: 'printing', label: 'প্রিন্টিং' },
    { id: 'idcard', label: 'আইডি কার্ড' },
    { id: 'clothing', label: 'পোশাক' },
    { id: 'crest', label: 'ক্রেস্ট' }
  ];

  return (
    <div className="max-w-2xl mx-auto mt-16 
     my-10 p-1 bg-white  rounded-2xl overflow-hidden">
      <div className="bg-slate-900 p-6 text-white flex items-center gap-3">
        <FiPlusCircle className="text-2xl text-blue-400" />
        <h2 className="text-xl font-bold uppercase tracking-wider">নতুন প্রোডাক্ট যোগ করুন</h2>
      </div>

      <form className="p-8 space-y-6">
        {/* Product Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase">
            <FiPackage className="text-blue-600" /> প্রোডাক্টের নাম
          </label>
          <input
            type="text"
            placeholder="উদা: প্রিমিয়াম মগ প্রিন্টিং"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Size */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase">
              <FiMaximize2 className="text-blue-600" /> সাইজ / পরিমাপ
            </label>
            <input
              type="text"
              placeholder="উদা: A4, 12oz, XL"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Categories (Radio Buttons) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase">
              <FiTag className="text-blue-600" /> ক্যাটাগরি
            </label>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <label key={cat.id} className="cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    className="hidden peer"
                    defaultChecked={cat.id === 'printing'}
                  />
                  <span className="px-4 py-2 border border-slate-200 rounded-full text-sm font-medium block peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 group-hover:border-blue-400 transition-all">
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Product Bio */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase">
            <FiEdit3 className="text-blue-600" /> প্রোডাক্ট বিবরণ (Bio)
          </label>
          <textarea
            rows={4}
            placeholder="প্রোডাক্ট সম্পর্কে কিছু লিখুন..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors uppercase tracking-widest"
        >
          পোস্ট পাবলিশ করুন
        </motion.button>
      </form>
    </div>
  );
}
