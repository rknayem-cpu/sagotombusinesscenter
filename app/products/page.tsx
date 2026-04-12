"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Product {
  _id: string; title: string; price: number; imgUrl: string; category: string;
}

export default function ProductDisplayPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authRes, productsRes] = await Promise.all([
          fetch("/api/auth/check"),
          fetch(`/api/posts?t=${Date.now()}`, { cache: 'no-store' })
        ]);
        const authData = await authRes.json();
        const productsData = await productsRes.json();
        setIsLoggedIn(authData.isLoggedIn);
        if (productsData.success) setProducts(productsData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCartAction = async (id: string) => {
    if (!isLoggedIn) {
      const res = await Swal.fire({ title: 'Sign In', text: 'Please login to shop', icon: 'info', confirmButtonColor: '#000' });
      if (res.isConfirmed) router.push('/login');
      return;
    }
    setAddingId(id);
    const res = await fetch(`/api/cart/${id}`);
    if (res.ok) {
      window.dispatchEvent(new Event('cartUpdated'));
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Added!', showConfirmButton: false, timer: 1000 });
    }
    setAddingId(null);
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
    <div className="max-w-7xl mx-auto px-3 py-8 bg-white mt-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 border-b pb-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-tighter">New Drops</h2>
        <Link href="/teri" className="text-xs font-bold text-orange-600 border-b border-orange-600">VIEW ALL</Link>
      </div>

      {/* Product Grid - Mobile e gap komano hoyeche jate chobi boro dekhay */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {products.map((p) => (
          <div key={p._id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all">
            
            {/* Image Section - aspect-square mobile e full width nibe */}
            <div className="relative aspect-square md:aspect-[5/4] overflow-hidden bg-gray-20">
              <div className='justify-center flex w-full h-full '>

                <img 
                src={p.imgUrl} 
                alt={p.title} 
                className="md:w-[75%] w-[90%] h-full  transition-transform duration-500 group-hover:scale-110" 
              />

              </div>

              <div 
                onClick={() => router.push(`/products/${p._id}`)}
                className="absolute inset-0 bg-black/5 flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                
              </div>
              
            </div>

            {/* Content Section - Padding komano hoyeche */}
            <div className="p-2 md:p-3">
              <p className="text-[9px] text-orange-600 font-bold uppercase mb-0.5">{p.category}</p>
              <h3 className="text-xs md:text-sm font-bold text-gray-800 truncate mb-2">{p.title}</h3>
              
              <div className="flex items-center justify-between gap-1">
                <p className="text-sm md:text-lg font-black text-gray-950 truncate">৳{p.price}</p>
                <button 
                  onClick={() => handleCartAction(p._id)}
                  className="bg-black text-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg hover:bg-orange-600 active:scale-90 transition-all shadow-sm"
                >
                  {addingId === p._id ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={16} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center py-20 text-gray-400 text-sm">No products found.</p>
      )}
    </div>
  );
}