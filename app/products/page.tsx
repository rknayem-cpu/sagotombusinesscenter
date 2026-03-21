"use client";
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Loader2, PackageOpen, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Navigation er jonno
import Swal from 'sweetalert2';

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
    // 1. Auth check kora
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    // 2. Product fetch kora
    const fetchProducts = () => {
      fetch('/api/posts')
        .then(res => res.json())
        .then(data => { if (data.success) setProducts(data.data); })
        .finally(() => setLoading(false));
    };

    checkAuth();
    fetchProducts();
  }, []);

  // Login checking wrapper function
  const handleActionClick = (id: string, title: string) => {
    if (!isLoggedIn) {
      Swal.fire({
        title: 'Sign In Required',
        text: 'Please login to add items to your bag',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#f97316', // orange-500
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Login Now',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl',
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }
    
    // Jodi logged in thake, tobe eita call hobe
    handleAddToCart(id, title);
  };

  const handleAddToCart = async (id: string, title: string) => {
    setAddingId(id);
    try {
      const res = await fetch(`/api/cart/${id}`);
      if (res.ok) {
        window.dispatchEvent(new Event('cartUpdated'));
        Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: `${title} added to bag`, showConfirmButton: false,
          timer: 2000, timerProgressBar: true,
        });
      }
    } finally { setAddingId(null); }
  };

  if (loading) return <div className="h-screen grid place-items-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto mt-12 py-12 px-4">
      <header className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-black text-slate-900">New Drops.</h2>
        <p className="text-slate-500 italic">Handpicked just for you.</p>
      </header>

      {products.length === 0 ? (
        <div className="text-center py-20 opacity-20"><PackageOpen size={60} className="mx-auto" /><p>NO STOCK</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((p) => (
            <div key={p._id} className="group relative rounded-xl border border-slate-200 hover:border-orange-500 transition-colors">
              <div className="relative aspect-[4/4] overflow-hidden rounded-xl bg-slate-100">
                <img src={p.imgUrl} alt={p.title}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 backdrop-blur-[2px]">
                   <Link href={`/product/${p._id}`} className="p-3 bg-white rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors">
                      <Eye size={20} />
                   </Link>
                   <button
                    disabled={addingId === p._id}
                    onClick={() => handleActionClick(p._id, p.title)} // Condition updated
                    className="p-3 bg-white rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors">
                      {addingId === p._id ? <Loader2 size={20} className="animate-spin" /> : <ShoppingCart size={20} />}
                   </button>
                </div>
              </div>

              <div className="mt-2 p-4">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">{p.category}</span>
                <h3 className="font-bold text-slate-800 truncate text-sm md:text-base">{p.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-black text-slate-900">${p.price}</p>
                  <button
                    onClick={() => handleActionClick(p._id, p.title)} // Condition updated
                    className="text-xs px-4 py-2 rounded-xl bg-orange-500 font-bold text-white hover:bg-orange-600 transition-colors">
                    + Add
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
