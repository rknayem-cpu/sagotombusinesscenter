"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, Zap, ShoppingCart, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import * as fbq from '@/lib/fpixel';

interface Product {
  _id: string; 
  title: string; 
  price: number; 
  imgUrl: string; 
  category: string;
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

  const handleAddToCart = (product: Product) => {
    setAddingId(product._id);
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex((item: any) => item._id === product._id);

      let updatedCart;
      if (existingItemIndex > -1) {
        updatedCart = [...existingCart];
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart = [...existingCart, { ...product, quantity: 1 }];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      fbq.event('AddToCart', {
        content_ids: [product._id],
        content_name: product.title,
        value: product.price,
        currency: 'BDT'
      });

      window.dispatchEvent(new Event('cartUpdated'));
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Added to bag', showConfirmButton: false, timer: 1000 });
    } finally {
      setAddingId(null);
    }
  };

  if (loading) return (
      <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
      <div className="max-w-7xl mx-auto mt-12 py-12 px-4">
        <header className="mb-10">
          {/* maxWidth এরর ফিক্স করা হয়েছে className এর মাধ্যমে */}
          <div className="max-w-[200px] mb-2">
            <Skeleton height={40} width="100%" />
          </div>
          <div className="max-w-[150px]">
            <Skeleton height={20} width="100%" />
          </div>
        </header>
    
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="rounded-xl border border-slate-100 p-2 overflow-hidden">
              
              {/* Responsive aspect ratio image skeleton */}
              <div className="w-full aspect-square md:aspect-[4/3] overflow-hidden rounded-xl">
                 <Skeleton height="100%" width="100%" containerClassName="flex-1" />
              </div>
    
              <div className="mt-4 space-y-2">
                <Skeleton width="40%" />
                <Skeleton width="90%" height={20} />
                
                <div className="flex justify-between items-center mt-4">
                  <Skeleton width={50} height={25} />
                  <div className="w-8 h-8 md:w-10 md:h-10">
                    <Skeleton circle height="100%" width="100%" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 mt-16">
      {categories.map((cat) => (
        <section key={cat} className="mb-12">
          <h3 className="text-xl p-3 border border-orange-500 rounded-lg w-fit font-bold text-orange-500 mb-6 border-b pb-2 uppercase tracking-tight">
            {cat}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products
              .filter(p => p.category === cat)
              .slice(0, visibleCount)
              .map((p) => (
                <div key={p._id} className="group border rounded-lg p-2 hover:border-gray-300 transition-all">
                  {/* Image: Click to details */}
                  <div 
                    onClick={() => router.push(`/products/${p._id}`)}
                    className="relative aspect-square overflow-hidden rounded-md bg-gray-50 cursor-pointer"
                  >
                    <img 
                      src={p.imgUrl} 
                      alt={p.title} 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                    />
                  </div>

                  {/* Info Section */}
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-gray-700 truncate uppercase">
                        {p.title}
                      </h3>
                      <p className="text-sm font-black text-gray-900 mt-1">৳{p.price}</p>
                    </div>

                    {/* Cart Button Right Side */}
                    <button 
                      onClick={() => handleAddToCart(p)}
                      disabled={addingId === p._id}
                      className="bg-gray-100 text-gray-900 p-2 rounded-md hover:bg-orange-600 hover:text-white transition-colors"
                    >
                      {addingId === p._id ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}

      {visibleCount < products.length && (
        <div className="flex justify-center mt-10">
          <button 
            onClick={() => setVisibleCount(prev => prev + 4)}
            className="border border-gray-900 px-8 py-2 font-bold text-xs hover:bg-gray-900 hover:text-white transition"
          >
            SHOW MORE
          </button>
        </div>
      )}
    </div>
  );
}