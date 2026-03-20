"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Tag, Maximize2, Loader2, PackageOpen } from 'lucide-react';

export default function ProductDisplayPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. API theke data fetch kora
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/posts');
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10  py-16 px-6 lg:px-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Latest Collections
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Explore our newest arrivals with premium quality and exclusive designs.
        </p>
      </div>

      {/* Grid Section */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <PackageOpen size={64} strokeWidth={1} />
          <p className="mt-4 text-xl">No products found. Start adding some!</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product._id} 
              className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                <img
                  src={product.imgUrl}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[12px] font-bold text-slate-900 shadow-sm border border-white/20">
                  {product.category}
                </div>

                {/* Hover Overlay Actions */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button className="p-3 bg-white rounded-full text-slate-900 hover:bg-blue-600 hover:text-white transition-colors shadow-lg">
                    <Maximize2 size={20} />
                  </button>
                  <button className="p-3 bg-white rounded-full text-slate-900 hover:bg-blue-600 hover:text-white transition-colors shadow-lg">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                </div>
                
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">
                  {product.bio}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Size:</span>
                  <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {product.size}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-medium">Price</span>
                    <span className="text-2xl font-black text-slate-900">
                      ${product.price}
                    </span>
                  </div>
                  <button className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all active:scale-95">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
