"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Navigation er jonno
import { IoCartOutline } from 'react-icons/io5';
import Swal from 'sweetalert2'; // Stylish alert er jonno

export default function CartIcon() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 1. Auth Status Check korar function
  const checkAuthStatus = async () => {
    try {
      const res = await fetch("/api/auth/check");
      const data = await res.json();
      setIsLoggedIn(data.isLoggedIn);
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  // 2. Cart Count fetch korar function
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
  checkAuthStatus();
  fetchCartCount();

  const handleCartUpdate = () => fetchCartCount();
  const handleAuthUpdate = () => checkAuthStatus(); // Auth status update function

  window.addEventListener('cartUpdated', handleCartUpdate);
  window.addEventListener('authChange', handleAuthUpdate); // Event listen kora

  return () => {
    window.removeEventListener('cartUpdated', handleCartUpdate);
    window.removeEventListener('authChange', handleAuthUpdate);
  };
}, []);








  // 3. Handle Navigation with Auth Check
  const handleCartClick = () => {
    if (isLoggedIn) {
      router.push('/cart');
    } else {
      Swal.fire({
        title: 'Access Denied!',
        text: 'Please login to use this feature',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ea580c', // orange-600 color
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Login Now',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-lg px-5 py-2',
          cancelButton: 'rounded-lg px-5 py-2'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login'); // Login page e redirect korbe
        }
      });
    }
  };

  return (
    <button 
      onClick={handleCartClick}
      className="relative p-2 text-slate-700 hover:text-orange-500 transition-all outline-none"
    >
      <IoCartOutline className="text-3xl" />
      {cartCount > 0 && (
        <span className="absolute top-5 right-1 bg-orange-600 text-white text-[10px] 
                         font-bold w-6 h-6 flex items-center justify-center 
                         rounded-full border-2 border-white shadow-sm">
          {cartCount}
        </span>
      )}
    </button>
  );
}
