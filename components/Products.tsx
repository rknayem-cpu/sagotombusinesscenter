"use client";
import * as fbq from '@/lib/fpixel';
import React, { useEffect, useState } from 'react';
import { Loader2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Product {
  _id: string; 
  title: string; 
  price: number; 
  imgUrl: string; 
  category: string;
}

export default function ProductDisplayPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch(`/api/posts?t=${Date.now()}`, { cache: 'no-store' });
        const productsData = await productsRes.json();
        if (productsData.success) setProducts(productsData.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCartAction = (product: Product) => {
    setAddingId(product._id);

    try {
      // 1. Get existing cart from LocalStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

      // 2. Check if product already exists
      const itemIndex = existingCart.findIndex((item: any) => item._id === product._id);

      if (itemIndex > -1) {
        // Jodi thake, quantity barate paren (Optional)
        existingCart[itemIndex].quantity += 1;
      } else {
        // Na thakle notun kore add hobe
        existingCart.push({
          ...product,
          quantity: 1
        });
      }

      // 3. Save back to LocalStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));

      // --- FACEBOOK PIXEL TRACKING START ---
   fbq.event('AddToCart', {
        content_ids: [product._id],
        content_name: product.title,
        content_type: 'product',
        value: product.price,
        currency: 'BDT'
      });

      // 4. Dispatch custom event jate Navbar update hoy
      window.dispatchEvent(new Event('cartUpdated'));

      // Success Message
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Cart-e add hoyeche!',
        showConfirmButton: false,
        timer: 1500
      });

    } catch (error) {
      console.error("Cart error:", error);
    } finally {
      setAddingId(null);
    }
  };

  // --- LOADING STATE (SKELETON) ---
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
    <div className="max-w-7xl mx-auto px-3 py-8 bg-white mt-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 border-b pb-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-tighter">New Drops</h2>
        <Link href="/categories" className="text-xs font-bold text-orange-600 border-b border-orange-600">VIEW ALL</Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {products.map((p) => (
          <div key={p._id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all">
            <div className="relative aspect-square md:aspect-[5/4] overflow-hidden bg-gray-50 flex items-center justify-center">
              <img 
                src={p.imgUrl} 
                alt={p.title} 
                className="md:w-[75%] w-[90%] h-auto transition-transform duration-500 group-hover:scale-110" 
              />
              <div 
                onClick={() => router.push(`/products/${p._id}`)}
                className="absolute inset-0 bg-black/5 cursor-pointer"
              />
            </div>

            {/* Content Section */}
            <div className="p-2 md:p-3">
              <p className="text-[9px] text-orange-600 font-bold uppercase mb-0.5">{p.category}</p>
              <h3 className="text-xs md:text-sm font-bold text-gray-800 truncate mb-2">{p.title}</h3>
              
              <div className="flex items-center justify-between gap-1">
                <p className="text-sm md:text-lg font-black text-gray-950">৳{p.price}</p>
                <button 
                  onClick={() => handleCartAction(p)}
                  className="bg-black text-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg hover:bg-orange-600 active:scale-90 transition-all"
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