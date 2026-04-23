"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Product {
  _id: string;
  title: string;
  price: number;
  imgUrl: string;
  category?: string;
  size?: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const deliveryFee = 80;

  // --- 1. Fetch Cart from LocalStorage ---
  const fetchCart = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
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

  // --- 2. Update Quantity in LocalStorage ---
  const updateQuantity = (id: string, action: 'inc' | 'dec' | 'delete') => {
    let updatedCart = [...cartItems];

    if (action === 'delete') {
      updatedCart = updatedCart.filter(item => item._id !== id);
    } else {
      updatedCart = updatedCart.map(item => {
        if (item._id === id) {
          const newQty = action === 'inc' ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      });
    }

    // Save back to LocalStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    // Sync with Navbar
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // --- 3. Checkout Logic ---
  const handleCheckout = () => {
    const orderSummary = {
      items: cartItems.map(item => ({
        id: item._id,
        title: item.title,
        imgUrl: item.imgUrl,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: subtotal + deliveryFee,
    };
    
    localStorage.setItem('pendingOrder', JSON.stringify(orderSummary));
    router.push('/checkout');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // --- LOADING SKELETON ---
  if (loading) return (
    <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
      <div className="min-h-screen bg-gray-50/50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <Skeleton width={250} height={40} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-5 rounded-xl flex gap-6 items-center">
                  <Skeleton width={90} height={90} borderRadius={10} />
                  <div className="flex-1">
                    <Skeleton width="60%" height={20} />
                    <Skeleton width="20%" height={25} className="mt-4" />
                  </div>
                  <Skeleton width={80} height={40} />
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <Skeleton height={300} borderRadius={20} />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2">
          <ShoppingBag className="text-orange-600" /> My Cart ({cartItems.length})
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-center mb-4">
              <ShoppingBag size={64} className="text-gray-200" />
            </div>
            <p className="text-gray-500 mb-6 text-lg">Apnar cart-e kono product nei.</p>
            <Link href="/" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm">
                  <img src={item.imgUrl} alt={item.title} className="w-20 h-20 object-cover rounded-lg bg-gray-50" />
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-gray-400 mb-1">{item.category || 'Product'}</p>
                    <p className="text-orange-600 font-bold">৳{item.price}</p>
                  </div>

                  <div className="flex items-center gap-2 md:gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-gray-50 rounded-lg border">
                      <button 
                        onClick={() => updateQuantity(item._id, 'dec')} 
                        className="p-2 hover:text-orange-600 transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-2 font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, 'inc')} 
                        className="p-2 hover:text-orange-600 transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button 
                      onClick={() => updateQuantity(item._id, 'delete')}
                      className="p-2 text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold mb-5 pb-2 border-b">Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charge</span>
                    <span className="text-green-600">৳{deliveryFee}</span>
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-orange-600">৳{subtotal + deliveryFee}</span>
                  </div>

                  <button 
                    onClick={handleCheckout} 
                    className="w-full mt-6 py-4 bg-black text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                  >
                    অর্ডার প্লেস করুন
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}