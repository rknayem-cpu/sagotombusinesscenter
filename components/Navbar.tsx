"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  IoMenu, IoClose, IoHomeOutline, IoBagHandleOutline, 
  IoGridOutline, IoEllipsisHorizontalCircleOutline, 
  IoPersonOutline, IoLogInOutline 
} from "react-icons/io5";

// Alada component theke import
import CartIcon from "@/components/CartIcon"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const navItems = [
    { name: "হোম", href: "/", icon: <IoHomeOutline /> },
    isLoggedIn
      ? { name: "প্রোফাইল", href: "/profile", icon: <IoPersonOutline /> }
      : { name: "লগইন", href: "/login", icon: <IoLogInOutline /> },
    { name: "পন্য", href: "/products", icon: <IoBagHandleOutline /> },
    { name: "বিভাগ", href: "/categories", icon: <IoGridOutline /> },
    { name: "আরো", href: "/more", icon: <IoEllipsisHorizontalCircleOutline /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* --- Main Navbar --- */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 h-16
                      bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm z-50">

        {/* Logo */}
        <Link href="/">
          <img src="/sbc.png" className="w-10 hover:scale-105 transition" alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-8 font-semibold text-slate-700">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="hover:text-orange-500 transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* PC Screen e sobar sheshe CartIcon */}
          <div className="border-l pl-4 border-slate-200">
            <CartIcon />
          </div>
        </div>

        {/* Mobile Icons (Cart + Hamburger) */}
        <div className="flex items-center gap-2 md:hidden">
          {/* 3-dot line (Menu) er thik bam pashe CartIcon */}
          <CartIcon />
          
          <button onClick={toggleSidebar} className="text-3xl text-slate-800 transition-all active:scale-90 p-1">
            {isOpen ? <IoClose className="text-orange-600" /> : <IoMenu />}
          </button>
        </div>
      </nav>

      {/* --- Mobile Sidebar --- */}
      <div className={`fixed top-0 right-0 h-full w-[280px] bg-white/95 backdrop-blur-2xl shadow-2xl
                      transition-transform duration-500 ease-in-out z-[60] border-l border-white/40
                      ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        <div className="p-6 flex justify-between items-center border-b border-slate-100">
          <span className="font-bold text-orange-600">Main Menu</span>
          <IoClose className="text-2xl cursor-pointer" onClick={toggleSidebar} />
        </div>

        <ul className="flex flex-col py-2 px-2">
          {navItems.map((item) => (
            <li key={item.name} onClick={toggleSidebar}>
              <Link href={item.href}
                className="flex items-center gap-4 p-4 rounded-xl text-slate-700 font-medium
                           hover:bg-orange-500 hover:text-white transition-all duration-300 group">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-lg">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Overlay --- */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55]"
             onClick={toggleSidebar} />
      )}
    </>
  );
}
