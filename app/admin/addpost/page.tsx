"use client";

import React, { useState } from 'react';
import { Package, ImagePlus, DollarSign, Type, AlignLeft, Layers3, Loader2 } from 'lucide-react';

const categories = ['Electronics', 'Clothing', 'Home Appliance', 'Beauty'];

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    imgUrl: '',
    imgUrl2: '',
    bio: '',
    size: '',
    price: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Success: Product posted successfully!");
        // Form Reset
        setFormData({ title: '', imgUrl: '', imgUrl2: '', bio: '', size: '', price: '', category: '' });
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen 
     py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mt-16 
       mx-auto bg-white rounded-[2.5rem] overflow-hidden">
        
        {/* Banner Section */}
        <div className="bg-slate-900 px-8 py-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Package className="text-blue-400" /> New Inventory
            </h1>
            <p className="text-slate-400 mt-2">Fill in the details to list a new product in your store.</p>
          </div>
          <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Type size={18} className="text-slate-400" /> Product Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Premium Wireless Headphones"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <ImagePlus size={18} className="text-slate-400" /> Main Image URL
                </label>
                <input
                  type="url"
                  name="imgUrl"
                  required
                  value={formData.imgUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <ImagePlus size={18} className="text-slate-400" /> Secondary URL (Opt)
                </label>
                <input
                  type="url"
                  name="imgUrl2"
                  value={formData.imgUrl2}
                  onChange={handleChange}
                  placeholder="Optional image"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">Size / Specs</label>
              <input
                type="text"
                name="size"
                required
                value={formData.size}
                onChange={handleChange}
                placeholder="Ex: XL, 42, 512GB"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <DollarSign size={18} className="text-slate-400" /> Price
              </label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <AlignLeft size={18} className="text-slate-400" /> Product Bio
            </label>
            <textarea
              name="bio"
              required
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Describe the key features..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-none"
            ></textarea>
          </div>

          {/* Section 3: Categories (Stylish Radio) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4">
              <Layers3 size={18} className="text-slate-400" /> Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <label key={cat} className="cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    onChange={handleChange}
                    checked={formData.category === cat}
                    required
                    className="sr-only"
                  />
                  <div className={`
                    py-3 px-2 rounded-xl text-center text-sm font-bold border-2 transition-all duration-300
                    ${formData.category === cat 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]' 
                      : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600'}
                  `}>
                    {cat}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-lg hover:bg-slate-800 active:scale-[0.98] transition-all disabled:bg-slate-400 flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Processing...
              </>
            ) : (
              "Publish Product"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
