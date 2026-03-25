"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, Zap, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { FaShoppingCart } from "react-icons/fa";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
interface Product {
  _id: string; title: string; price: number; imgUrl: string; category: string; size: string;
}

export default function ProductDisplayPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // SingleProductPage এর মতো শুরুতে true
  const [addingId, setAddingId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ১. একসাথেই Auth এবং Products ফেচ করা হচ্ছে
        const [authRes, productsRes] = await Promise.all([
          fetch("/api/auth/check"),
          // ক্যাশ ভাঙার জন্য টাইমস্ট্যাম্প যোগ করা হয়েছে
          fetch(`/api/posts?t=${Date.now()}`, { cache: 'no-store' })
        ]);

        const authData = await authRes.json();
        const productsData = await productsRes.json();

        setIsLoggedIn(authData.isLoggedIn);
        if (productsData.success) {
          setProducts(productsData.data);
        }
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        // সব ডাটা আসার পর লোডিং ফলস হবে, এতে স্কেলিটন বা লোডার দেখা যাবে
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleActionClick = (id: string, title: string) => {
    if (!isLoggedIn) {
      Swal.fire({
        title: 'Sign In Required',
        confirmButtonColor: '#000',
        confirmButtonText: 'Login',
      }).then((res) => res.isConfirmed && router.push('/login'));
      return;
    }
    handleAddToCart(id, title);
  };

  const handleAddToCart = async (id: string, title: string) => {
    setAddingId(id);
    try {
      const res = await fetch(`/api/cart/${id}`);
      if (res.ok) {
        window.dispatchEvent(new Event('cartUpdated'));
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Added!', showConfirmButton: false, timer: 1500 });
      }
    } finally { setAddingId(null); }
  };

  // --- স্কেলিটন লোডিং ভিউ (আপনার SingleProductPage এর স্টাইলে) ---
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
    <div className="max-w-7xl mx-auto py-12 px-4 bg-white mt-14">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-4xl font-black text-gray-950 tracking-tighter leading-none">
          New Drops<span className="text-orange-600">.</span>
        </h2>
        <Link href="/products" className="text-xs font-bold border-b-2 border-black pb-0.5 hover:text-orange-500 transition flex items-center gap-1">
          VIEW ALL <Zap size={12} className="fill-orange-500 text-orange-500" />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 border rounded-3xl text-gray-400 font-bold uppercase tracking-widest text-xs">
          No Stock Available
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <div key={p._id} className="border border-slate-100 rounded-2xl p-2 transition bg-white hover:border-orange-200">
              <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-xl bg-gray-50">
                <div className='w-full h-full flex justify-center'>
                  <img 
                    src={p.imgUrl} 
                    alt={p.title}
                    className="h-full group-hover:scale-110 transition duration-700 object-cover" 
                  />
                </div>
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase shadow-sm">
                  New
                </div>
                
                <Link href={`/products/${p._id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 transition backdrop-blur-[1px]">
                   <div className="bg-white p-3 rounded-full shadow-xl text-black active:scale-90 transition">
                     <Eye size={20}/>
                   </div>
                </Link>
              </div>

              <div className="mt-3 px-1">
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tight leading-none">{p.category}</p>
                <h3 className="text-sm font-extrabold text-gray-900 mt-1 line-clamp-1 leading-tight uppercase">{p.title}</h3>
                
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold leading-none">Price</span>
                    <p className="text-lg font-black text-gray-950 tracking-tighter leading-none">{p.price} taka</p>
                  </div>

                  <button 
                    onClick={() => handleActionClick(p._id, p.title)}
                    className="bg-black text-white p-3 rounded-xl hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                  >
                    {addingId === p._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <FaShoppingCart size={18} />
                    )}
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