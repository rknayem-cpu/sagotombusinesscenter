"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoCartOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';

export default function CartIcon() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 1. Auth Status & Cart Count check korar unified function
  const refreshStatus = async () => {
    try {
      const res = await fetch("/api/auth/check", { cache: 'no-store' });
      const data = await res.json();
      setIsLoggedIn(data.isLoggedIn);

      if (data.isLoggedIn) {
        // Jodi login thake, tobe cart count fetch koro
        const cartRes = await fetch('/api/cart/count', { cache: 'no-store' });
        const cartData = await cartRes.json();
        if (cartData.success) setCartCount(cartData.count);
      } else {
        // Logout thakle count 0 kore dao
        setCartCount(0);
      }
    } catch (err) {
      setIsLoggedIn(false);
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshStatus(); // Page load hole prothom bar call

    // Listener function
    const handleUpdate = () => {
      console.log("Signal Received! Refreshing...");
      refreshStatus();
    };

    window.addEventListener('cartUpdated', handleUpdate);
    window.addEventListener('authChange', handleUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleUpdate);
      window.removeEventListener('authChange', handleUpdate);
    };
  }, []);

  const handleCartClick = () => {
    if (isLoggedIn) {
      router.push('/cart');
    } else {
      Swal.fire({
        title: 'Access Denied!',
        text: 'Please login to use this feature',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ea580c',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Login Now',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
    }
  };

  return (
    <button onClick={handleCartClick} className="relative p-2 text-slate-700 hover:text-orange-500 transition-all outline-none">
      <IoCartOutline className="text-3xl" />
      {isLoggedIn && cartCount > 0 && (
        <span className="absolute top-5 right-1 bg-orange-600 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
          {cartCount}
        </span>
      )}
    </button>
  );
}