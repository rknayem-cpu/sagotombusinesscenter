"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, Zap, ChevronRight, LayoutGrid, Eye, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Product {
  _id: string; title: string; price: number; imgUrl: string; category: string;
}

export default function CategoryProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [addingId, setAddingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => { if (data.success) setProducts(data.data); })
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleAddToCart = async (id: string) => {
    setAddingId(id);
    try {
      const res = await fetch(`/api/cart/${id}`);
      if (res.ok) {
        window.dispatchEvent(new Event('cartUpdated'));
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Added to bag', showConfirmButton: false, timer: 1000 });
      } else {
        Swal.fire({ toast: true, position: 'top-start', icon: 'error', title: 'please login frist!', 
          showConfirmButton: false, timer: 1000 });
      }
    } finally { setAddingId(null); }
  };

  if (loading) return (
     <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
              <div className="max-w-7xl mx-auto mt-12 py-12 px-4">
                
                {/* Header Skeleton: New Drops. */}
                <header className="mb-10 text-center md:text-left">
                  <Skeleton width={200} height={40} className="mb-2" />
                  <Skeleton width={150} height={20} />
                </header>
        
                {/* Product Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                  {/* ৮টি কার্ড দেখাচ্ছি যাতে পুরো স্ক্রিন ভরে থাকে */}
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="rounded-xl border border-slate-100 p-2">
                      
                      {/* Image Box Skeleton */}
                      <div className="relative aspect-[4/4] overflow-hidden rounded-xl">
                        <Skeleton height="100%" containerClassName="flex-1" />
                      </div>
        
                      {/* Text and Button Skeleton */}
                      <div className="mt-4 p-2 space-y-3">
                        {/* Category Tag */}
                        <Skeleton width={60} height={12} />
                        
                        {/* Title */}
                        <Skeleton width="90%" height={18} />
                        
                        <div className="flex items-center justify-between mt-4">
                          {/* Price */}
                          <Skeleton width={50} height={20} />
                          
                          {/* Add Button */}
                          <Skeleton width={60} height={32} borderRadius={12} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SkeletonTheme>
  );

  return (
    <div className="max-w-7xl mx-auto py-20 px-4 bg-[#fafafa]">
      
      {/* --- Page Header --- */}
      <div className="mb-8 relative">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none italic opacity-5 absolute -top-10 -left-2 select-none">
          Catalog
        </h1>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
            Collections<span className="text-orange-500">.</span>
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-[2px] w-10 bg-orange-500"></span>
            <p className="text-slate-500 font-bold text-[10px] tracking-[0.3em] uppercase">Premium selection for you</p>
          </div>
        </div>
      </div>

      {/* --- Category Loop --- */}
      {categories.map((cat) => (
        <section key={cat} className="mb-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <LayoutGrid size={22} className="text-orange-500" /> {cat}
              </h3>
            </div>
            <Link href={`/products`} className="group text-[11px] font-black text-slate-400 hover:text-orange-600 transition-all flex items-center gap-1 uppercase tracking-widest">
              View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
            {products
              .filter(p => p.category === cat)
              .slice(0, visibleCount)
              .map((p) => (
                <div key={p._id} className="group relative bg-white border border-slate-100 rounded-[1.5rem] p-2 md:p-3 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-orange-100">
                  
                  {/* Image: Mobile e Square, PC te balanced */}
                  <div className="relative aspect-[2/3] md:aspect-[4/4]
                   overflow-hidden rounded-[1.2rem] bg-slate-20">
                    <img 
                      src={p.imgUrl} 
                      alt={p.title} 
                      className="w-full h-full cursor-pointer object-cover transition duration-700 group-hover:scale-110" 
                    />
                    
                    {/* Hover Overlay */}
                    <div  onClick={() => router.push(`/products/${p._id}`)} 
                    className="absolute cursor-pointer inset-0 bg-black/10 opacity-0 
                    group-hover:opacity-100 transition-all duration-300 
                    flex items-center justify-center gap-2">
                      
                    </div>

                    {/* Quick Add Button */}
                    <button 
                      onClick={() => handleAddToCart(p._id)}
                      className="absolute bottom-3 right-3 bg-slate-900 text-white p-3 rounded-xl shadow-2xl translate-y-12 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-500"
                    >
                      {addingId === p._id ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={18} />}
                    </button>
                  </div>

                  <div className="mt-4 px-1 pb-1">
                    <h3 className="text-xs md:text-sm font-bold text-slate-800 line-clamp-1 uppercase tracking-tight">{p.title}</h3>
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-base md:text-lg font-black text-slate-900 tracking-tighter">৳{p.price}</p>
                      <Link href={`/products/${p._id}`} className="text-[9px] font-black text-slate-400 hover:text-orange-500 uppercase tracking-tighter transition">
                        <Eye size={30} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}

      {/* --- Improved Load More --- */}
      {visibleCount < products.length && (
        <div className="flex justify-center mt-10">
          <button 
            onClick={() => setVisibleCount(prev => prev + 4)}
            className="flex items-center gap-3 bg-white border-2 border-slate-900 text-slate-900 px-10 py-4 rounded-full font-black text-[10px] tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all duration-300 active:scale-95"
          >
            <Zap size={14} fill="currentColor" />
            SHOW MORE PIECES
          </button>
        </div>
      )}
    </div>
  );
}