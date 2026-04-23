"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoCartOutline } from 'react-icons/io5';

export default function CartIcon() {
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // LocalStorage theke total item count korar function
  const refreshCartCount = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        // Quantity-r jogfol ber kora (jodi 1ta product 2 bar thake tobe count 2 hobe)
        const total = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Cart count error:", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    // Page load hole count check korbe
    refreshCartCount();

    // Onno page theke 'cartUpdated' signal asle count update hobe
    const handleUpdate = () => {
      refreshCartCount();
    };

    window.addEventListener('cartUpdated', handleUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleUpdate);
    };
  }, []);

  const handleCartClick = () => {
    // Akhon kono login check nei, direct cart page-e niye jabe
    router.push('/cart');
  };

  return (
    <button 
      onClick={handleCartClick} 
      className="relative p-2 text-slate-700 hover:text-orange-500 transition-all outline-none"
    >
      <IoCartOutline className="text-3xl" />
      
      {/* Login thakuk ba na thakuk, item thaklei badge dekhabe */}
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      )}
    </button>
  );
}