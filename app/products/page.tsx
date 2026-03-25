"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Loader2, PackageOpen, Eye, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { FaShoppingCart } from "react-icons/fa";
interface Product {
  _id: string; title: string; price: number; imgUrl: string; category: string; size: string;
}

export default function ProductDisplayPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch { 
        setIsLoggedIn(false); 

      }finally {
        setLoading(false);
      }
    };

    const fetchProducts = () => {
      fetch('/api/posts')
        .then(res => res.json())
        .then(data => { if (data.success) setProducts(data.data); })
        .finally(() => setLoading(false));
    };
    checkAuth();
    fetchProducts();
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

  if (loading) return <div className="min-h-screen w-full bg-white">
    
    </div>;
  if (!products) return <div className="min-h-screen flex items-center justify-center">Product Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 bg-white mt-14">
      {/* Tight Header */}
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-4xl font-black text-gray-950 tracking-tighter leading-none">New Drops<span className="text-orange-600">.</span></h2>
        <Link href="/products" className="text-xs font-bold border-b-2 border-black pb-0.5 hover:text-orange-500 transition flex items-center gap-1">
          VIEW ALL <Zap size={12} className="fill-orange-500 text-orange-500" />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 border rounded-3xl text-gray-400 font-bold uppercase tracking-widest text-xs">No Stock</div>
      ) : (
        /* Grid Layout: Compact Spacing */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <div key={p._id} className="group border border-slate-100 rounded-2xl p-2 transition hover:shadow-xl hover:border-orange-500 bg-white">
              
              {/* Image Container: Fixed Height for consistency */}
              <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-xl bg-gray-50">
                <img 
                  src={p.imgUrl} 
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                />
                
                {/* Floating Badge */}
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase shadow-sm">
                  New
                </div>
                
                {/* Hover Eye Icon */}
                <Link href={`/products/${p._id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 transition backdrop-blur-[2px]">
                   <div className="bg-white p-2 rounded-full shadow-lg text-black"><Eye size={18}/></div>
                </Link>
              </div>

              {/* Product Details: Compact Vertical Spacing */}
              <div className="mt-3 px-1">
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tight leading-none">{p.category}</p>
                <h3 className="text-sm font-extrabold text-gray-900 mt-1 line-clamp-1 leading-tight">{p.title}</h3>
                
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold leading-none">Price</span>
                    <p className="text-lg font-black text-gray-950 tracking-tighter leading-none">${p.price}</p>
                  </div>

                  {/* Stylish Bag Button */}
                  <button 
                    onClick={() => handleActionClick(p._id, p.title)}
                    className="bg-black text-white p-2.5 rounded-xl hover:bg-orange-600 transition-colors shadow-lg active:scale-90"
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