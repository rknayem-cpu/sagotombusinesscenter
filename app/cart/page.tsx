"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();




const deliveryFee = 80; // ফিক্সড ডেলিভারি চার্জ
const handleCheckout = () => {
  const orderSummary = {
    items: cartItems.map(item => ({
      title: item.post.title,
      imgUrl: item.post.imgUrl,
      quantity: item.quantity,
      price: item.post.price,
    })),
    totalAmount: subtotal + deliveryFee, // মোট দাম + ডেলিভারি চার্জ
  };
  
  // LocalStorage এ সেভ করা
  localStorage.setItem('pendingOrder', JSON.stringify(orderSummary));
  
  // Checkout পেজে রিডাইরেক্ট
  router.push('/checkout');
};





  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart/all');
      const data = await res.json();
      if (data.success) setCartItems(data.data);
    } catch (err) {
      console.error("Cart fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id: string, action: 'inc' | 'dec' | 'delete') => {
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
  <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
        <div className="min-h-screen bg-slate-50/50 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            
           
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <Skeleton circle width={40} height={40} />
                <Skeleton width={250} height={40} borderRadius={10} />
              </div>
              <Skeleton width={150} height={20} />
            </div>
  
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left Side: Cart Items Skeleton (Showing 3 items) */}
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex gap-6 items-center shadow-sm">
                    {/* Product Image Skeleton */}
                    <Skeleton width={96} height={96} borderRadius={16} />
  
                    <div className="flex-1">
                      {/* Title and Size */}
                      <Skeleton width="60%" height={20} className="mb-2" />
                      <Skeleton width="30%" height={15} />
                      {/* Price */}
                      <Skeleton width="20%" height={25} className="mt-4" />
                    </div>
  
                    {/* Quantity Controls Skeleton */}
                    <div className="w-24">
                      <Skeleton height={40} borderRadius={12} />
                    </div>
                  </div>
                ))}
              </div>
  
              {/* Right Side: Order Summary Skeleton */}
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 sticky top-24">
                  <Skeleton width={150} height={25} className="mb-6" />
                  
                  <div className="space-y-4 border-b border-slate-100 pb-6 mb-6">
                    <div className="flex justify-between">
                      <Skeleton width={80} />
                      <Skeleton width={60} />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton width={80} />
                      <Skeleton width={40} />
                    </div>
                  </div>
  
                  <div className="flex justify-between items-end mb-8">
                    <Skeleton width={100} height={15} />
                    <Skeleton width={100} height={40} />
                  </div>
  
                  {/* Checkout Button Skeleton */}
                  <Skeleton height={60} borderRadius={16} />
                  
                  <div className="mt-6 flex justify-center">
                    <Skeleton width={120} height={10} />
                  </div>
                </div>
              </div>
  
            </div>
          </div>
        </div>
      </SkeletonTheme>
)
  if (!cartItems) return <div className="min-h-screen flex items-center justify-center">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <ShoppingBag /> My Cart ({cartItems.length})
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-lg shadow-sm border">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link href="/products" className="text-orange-600 font-bold underline">
              Go to Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.post._id} className="bg-white p-4 rounded-lg border flex flex-col sm:flex-row items-center gap-4">
                  <img src={item.post.imgUrl} alt={item.post.title} className="w-20 h-20 object-cover rounded" />
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-gray-800">{item.post.title}</h3>
                    <p className="text-sm text-gray-400">Size: {item.post.size}</p>
                    <p className="text-gray-900 font-bold">প্রতি পিস: {item.post.price} টাকা</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border rounded">
                      <button onClick={() => updateQuantity(item.post._id, 'dec')} className="p-2 hover:bg-gray-100" disabled={item.quantity <= 1}>
                        <Minus size={14} />
                      </button>
                      <span className="px-3 font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.post._id, 'inc')} className="p-2 hover:bg-gray-100">
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button 
                      onClick={() => updateQuantity(item.post._id, 'delete')}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-24">
                <h2 className="text-xl font-bold mb-5 pb-2 border-b">Price Details</h2>
                
                <div className="space-y-4">
                  {/* Detailed breakdown: Price x Quantity */}
                  {cartItems.map((item) => (
                    <div key={item.post._id} className="flex justify-between text-sm text-gray-600">
                      <span className="truncate max-w-[150px]">{item.post.title} - {""}{item.quantity} পিস </span>
                      <span>{(item.post.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>মোট দাম</span>
                      <span>{subtotal} টাকা</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>ডেলিভারি চার্জ</span>
                      <span className="text-green-600 font-medium">{deliveryFee} টাকা</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">সর্বমোট দাম</span>
                    <span className="text-2xl font-bold text-orange-600">{subtotal + deliveryFee} টাকা</span>
                  </div>

                  <button onClick={handleCheckout} className="w-full mt-6 py-4 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition">
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