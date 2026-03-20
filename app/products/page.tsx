"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Loader2, PackageOpen } from 'lucide-react';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function ProductDisplayPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(res => res.success && setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  
  
  const handleAddToCart = async (productId, title) => {
  try {
    const response = await fetch(`/api/cart/${productId}`);
    
    if (response.ok) {
      // --- Etai Jadu! ---
      // Eta Navbar er CartIcon ke signal pathabe "Count update koro"
      window.dispatchEvent(new Event('cartUpdated'));

      // Tomar SweetAlert code...
      Swal.fire({ title: 'Added!', icon: 'success' });
    }
  } catch (error) {
    console.error(error);
  }
};

  
  
  
  
  

  if (loading) return (
    <div className="min-h-screen grid place-items-center bg-white">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <header className="mb-16">
        <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight">New Drops.</h2>
        <p className="text-slate-500 mt-2 text-lg font-medium italic">Handpicked just for you.</p>
      </header>

      {products.length === 0 ? (
        <div className="text-center py-24 opacity-30">
          <PackageOpen size={60} className="mx-auto mb-4" strokeWidth={1} />
          <p className="text-xl font-bold tracking-tight text-slate-900">NO STOCK AVAILABLE</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((p) => (
            <div key={p._id} className="group flex flex-col">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
                <img 
                  src={p.imgUrl} 
                  alt={p.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <button 
                  disabled={addingId === p._id}
                  onClick={() => handleAddToCart(p._id, p.title)}
                  className="absolute bottom-6 right-6 p-4 bg-white/90 backdrop-blur-md text-slate-900 rounded-2xl shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white disabled:opacity-50"
                >
                  {addingId === p._id ? <Loader2 size={20} className="animate-spin" /> : <ShoppingCart size={20} />}
                </button>
              </div>

              <div className="mt-6 px-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">
                  <span>{p.category}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-400">Size: {p.size}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {p.title}
                </h3>
                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <p className="text-2xl font-black text-slate-900">${p.price}</p>
                  <button 
                    onClick={() => handleAddToCart(p._id, p.title)}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 active:scale-90 transition-all shadow-md"
                  >
                    Add Now
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
