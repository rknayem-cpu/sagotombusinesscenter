"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoCartOutline } from 'react-icons/io5';

export default function CartIcon() {
  const [cartCount, setCartCount] = useState(0);

  // Function: API theke count ana
  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart/count');
      const data = await res.json();
      if (data.success) setCartCount(data.count);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    // 1. Page e asar sathe sathe akbar count anbe
    fetchCartCount();

    // 2. "cartUpdated" name e ekta listener setup korlam
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  return (
    <Link href="/cart" className="relative p-2
     text-slate-700 hover:text-orange-500 transition-all">
      <IoCartOutline className="text-3xl" />
      {cartCount > 0 && (
        <span className="absolute top-5 right-1
         bg-orange-600 text-white text-[10px] font-bold 
                         w-6 h-6 flex 
                         items-center justify-center
                          rounded-full border-2
                           border-white ">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
