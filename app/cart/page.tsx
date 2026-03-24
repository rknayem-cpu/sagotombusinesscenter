"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
    <div className="min-h-screen w-full bg-white">
      
    </div>
  );

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
                    <p className="text-gray-900 font-bold">${item.post.price.toFixed(2)}</p>
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
                      <span className="truncate max-w-[150px]">{item.post.title} ({""}x{item.quantity})</span>
                      <span>${(item.post.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Total Items Price</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping Fee</span>
                      <span className="text-green-600 font-medium">{deliveryFee.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total Payable</span>
                    <span className="text-2xl font-bold text-orange-600">{(subtotal + deliveryFee).toFixed(2)}</span>
                  </div>

                  <button onClick={handleCheckout} className="w-full mt-6 py-4 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition">
                    Proceed to Checkout
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