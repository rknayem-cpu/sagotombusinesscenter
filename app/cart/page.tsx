"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';

// Types Definition
interface Product {
  _id: string;
  title: string;
  price: number;
  imgUrl: string;
  size: string;
}

interface CartItem {
  post: Product;
  quantity: number;
}

export default function CartPage() {
  // Define state with the CartItem array type
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart/all');
      const data = await res.json();
      if (data.success) {
        setCartItems(data.data);
      }
    } catch (err) {
      console.error("Cart fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Use literal types for 'action' to prevent bugs
  const updateQuantity = async (id: string, action: 'inc' | 'dec') => {
    try {
      const res = await fetch(`/api/cart/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, action })
      });
      if (res.ok) {
        await fetchCart();
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.post.price * item.quantity), 0);

  if (loading) return (
    <div className="min-h-screen grid place-items-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <ShoppingBag className="text-orange-600" size={36} /> Shopping Bag
          </h1>
          <Link href="/products" className="text-slate-500 font-bold flex items-center gap-2 hover:text-orange-600 transition">
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center bg-white rounded-[2.5rem] py-20 shadow-sm border border-slate-100">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Your bag is empty</h2>
            <p className="text-slate-400 mt-2 mb-8">Looks like you haven't added anything yet.</p>
            <Link href="/products" className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 shadow-xl shadow-orange-200 transition-all active:scale-95">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.post._id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex gap-6 items-center shadow-sm group hover:shadow-md transition-all">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={item.post.imgUrl} alt={item.post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{item.post.title}</h3>
                    <p className="text-slate-400 text-sm font-semibold mt-1 uppercase tracking-tighter">Size: {item.post.size}</p>
                    <p className="text-orange-600 font-black text-xl mt-2">${item.post.price}</p>
                  </div>

                  <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                    <button 
                      onClick={() => updateQuantity(item.post._id, 'dec')} 
                      className="p-2 hover:bg-white rounded-lg transition shadow-sm"
                      disabled={item.quantity <= 1} // Optional: prevent zero/negative
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-black text-slate-800">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.post._id, 'inc')} className="p-2 hover:bg-white rounded-lg transition shadow-sm"><Plus size={16} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4 border-b border-slate-800 pb-6 mb-6">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Delivery</span>
                    <span className="text-green-400 font-bold underline decoration-dotted">Free</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mb-8">
                  <span className="text-slate-400 font-medium">Total Amount</span>
                  <span className="text-4xl font-black text-orange-500">${subtotal.toFixed(2)}</span>
                </div>
                <button className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black text-lg hover:bg-orange-500 transition-all active:scale-95 shadow-xl shadow-orange-900/20">
                  Checkout Now
                </button>
                <p className="text-[10px] text-slate-500 text-center mt-6 uppercase tracking-widest font-bold">Secure SSL Checkout</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
