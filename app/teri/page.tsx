"use client";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React, { useEffect, useState } from 'react';
import { ShoppingBag, Loader2, Zap, ChevronRight, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { FaShoppingCart } from "react-icons/fa";
interface Product {
  _id: string; title: string; price: number; imgUrl: string; category: string;
}

export default function CategoryProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8); // শুরুতে ৮টি দেখাবে
  const [addingId, setAddingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => { if (data.success) setProducts(data.data); })
      .finally(() => setLoading(false));
  }, []);

  // ক্যাটাগরি অনুযায়ী ডাটা গ্রুপ করা
  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleAddToCart = async (id: string, title: string) => {
    setAddingId(id);
    try {
      const res = await fetch(`/api/cart/${id}`);
      if (res.ok) {
        window.dispatchEvent(new Event('cartUpdated'));
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Added!', showConfirmButton: false, timer: 1000 });
      }
    } finally { setAddingId(null); }
  };

  if (loading) return <div className="min-h-screen bg-white" >
    
    
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
    </div>;

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 bg-white mt-10">
      
      {/* Page Title */}
      <div className="mb-12 border-l-4 border-orange-600 pl-6">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">Collections<span className="text-orange-600">.</span></h1>
        <p className="text-gray-400 font-bold text-xs tracking-[0.2em] mt-2 uppercase">Discover by categories</p>
      </div>

      {/* Category Sections */}
      {categories.map((cat) => (
        <section key={cat} className="mb-16">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <LayoutGrid size={18} className="text-orange-600" /> {cat}
            </h2>
            <Link href={`/products`} className="text-[10px] font-black text-gray-400 hover:text-black transition flex items-center gap-1 uppercase tracking-widest">
              View All <ChevronRight size={12} />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products
              .filter(p => p.category === cat)
              .slice(0, visibleCount) // Load more logic logic ekhane kaj korbe
              .map((p) => (
                <div key={p._id} className="group border border-slate-100 rounded-2xl p-2 transition hover:border-orange-500 bg-white">
                  <div className="relative h-44 md:h-56 w-full overflow-hidden rounded-xl bg-gray-50">
                    <img src={p.imgUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    <button 
                      onClick={() => handleAddToCart(p._id, p.title)}
                      className="absolute bottom-2 right-2 bg-black text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-xl"
                    >
                      {addingId === p._id ? <Loader2 size={14} className="animate-spin" /> : <FaShoppingCart size={16} />}
                    </button>
                  </div>

                  <div className="mt-3 px-1">
                    <h3 className="text-sm font-extrabold text-gray-900 line-clamp-1 leading-none">{p.title}</h3>
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-lg font-black text-gray-900 tracking-tighter">{p.price} টাকা</p>
                      <Link href={`/products/${p._id}`} className="text-[9px] font-bold text-orange-600 uppercase border border-orange-100 px-2 py-1 rounded-md hover:bg-orange-50 transition">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}

      {/* Load More Button */}
      {visibleCount < products.length && (
        <div className="flex flex-col items-center mt-12 gap-4">
            <div className="h-[1px] w-full bg-slate-100 max-w-xs"></div>
            <button 
                onClick={() => setVisibleCount(prev => prev + 4)}
                className="group flex items-center gap-3 bg-gray-950 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-2xl shadow-gray-200"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Zap size={14} className="group-hover:fill-white" />}
                LOAD MORE ITEMS
            </button>
        </div>
      )}

    </div>
  );
}