"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Star, ShieldCheck, Truck, Loader2, Plus, Minus } from 'lucide-react';

import Swal from 'sweetalert2';

interface Product {
  _id: string; title: string; price: number; imgUrl: string; imgUrl2?: string; 
  bio: string; size: string; category: string;
}

export default function SingleProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          setMainImg(data.data.imgUrl);
        }
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const res = await fetch(`/api/cart/${id}`);
      if (res.ok) {
        window.dispatchEvent(new Event('cartUpdated'));
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Added to bag', showConfirmButton: false, timer: 1500 });
      }
    } finally { setAdding(false); }
  };

  if (loading) return <div className="min-h-screen w-full bg-white">
    
    </div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation */}
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition">
          <ArrowLeft size={18} /> BACK TO COLLECTION
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Image Gallery (5 Columns) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3">
              {[product.imgUrl, product.imgUrl2].filter(Boolean).map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setMainImg(img!)}
                  className={`w-20 h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition ${mainImg === img ? 'border-orange-600' : 'border-transparent opacity-60'}`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 bg-gray-50 rounded-[2rem] overflow-hidden border border-slate-100">
              <img src={mainImg} alt={product.title} className="w-full h-[500px] md:h-[650px] object-cover hover:scale-105 transition duration-700" />
            </div>
          </div>

          {/* Right: Product Details (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-6">
              <span className="text-xs font-black tracking-[0.2em] text-orange-600 uppercase">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-950 mt-2 tracking-tighter leading-none">{product.title}</h1>
              
              <div className="flex items-center gap-4 mt-4">
                <p className="text-3xl font-black text-gray-950">${product.price.toFixed(2)}</p>
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                  <Star size={14} className="fill-orange-500 text-orange-500" />
                  <span className="text-xs font-bold">4.8 (120+ Reviews)</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{product.bio}</p>
              </div>

              {/* Size Selector (Simulated) */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Available Size</h3>
                <div className="flex gap-3">
                  {product.size.split(',').map((s) => (
                    <div key={s} className="px-5 py-2.5 border-2 border-gray-900 rounded-xl font-black text-sm hover:bg-black hover:text-white transition cursor-pointer">
                      {s.trim()}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 bg-orange-600 text-white h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-xl shadow-orange-100"
                >
                  {adding ? <Loader2 className="animate-spin" /> : <ShoppingBag size={22} />}
                  ADD TO CART
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ShieldCheck size={20} /></div>
                  <span className="text-[11px] font-bold text-gray-500 leading-none">ORIGINAL PRODUCT GUARANTEE</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Truck size={20} /></div>
                  <span className="text-[11px] font-bold text-gray-500 leading-none">FREE GLOBAL DELIVERY</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}