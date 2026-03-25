"use client";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  User, Mail, MapPin, LogOut, Loader2,
  Settings, ShoppingBag, ShieldCheck, Edit3
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ১. প্রোফাইল ডাটা ফেচ করার সময় টাইমস্ট্যাম্প ব্যবহার (Vercel Cache Bypass)
  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile?t=${Date.now()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: 'no-store'
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        // অথেন্টিকেশন না থাকলে সরাসরি লগইন
        router.push("/login");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [router]);

  // ২. লগআউট লজিক (রিলোড ছাড়া)
  const handleLogout = async () => {
    setLoading(true); // ইউজারকে একটা ফিডব্যাক দেওয়া
    try {
      const res = await fetch("/api/logout", { 
        method: "POST",
        cache: 'no-store' 
      });
      
      if (res.ok) {
        // ডাটাবেজ/কুকি থেকে লগআউট হওয়ার পর লোকাল স্টেট ক্লিয়ার করুন
        setUser(null); 
        
        // গ্লোবাল ইভেন্ট ফায়ার করা (Navbar/Cart আপডেট হবে)
        window.dispatchEvent(new Event('authChange'));
        window.dispatchEvent(new Event('cartUpdated'));
        
        // ৩. ভের্সেলকে বাধ্য করা সার্ভার কম্পোনেন্ট ডাটা আপডেট করতে
        router.refresh(); 
        
        // সরাসরি লগইন পেজে পাঠানো
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // স্কেলিটন লোডার (রিলোড ছাড়া সুন্দর দেখাবে)
  if (loading) return (
    <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
          <div className="min-h-screen bg-[#f1f5f9] pb-12">
            
            {/* Blue Header Skeleton Area */}
            <div className="h-64 bg-slate-300 relative">
              <div className="absolute -bottom-16 left-0 right-0 flex justify-center">
                {/* Profile Image Circle Skeleton */}
                <Skeleton circle width={128} height={128} className="border-4 border-white shadow-xl" />
              </div>
            </div>
    
            <div className="max-w-4xl mx-auto px-4 mt-20">
              {/* Name and Tagline Skeleton */}
              <div className="text-center mb-10 flex flex-col items-center">
                <Skeleton width={200} height={30} className="mb-2" />
                <Skeleton width={120} height={15} />
              </div>
    
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Side: Personal Info Skeleton */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <Skeleton width={180} height={25} className="mb-6" />
                    
                    <div className="space-y-6">
                      {/* Rows for Name, Email, Address */}
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center p-4 bg-slate-50 rounded-2xl">
                          <Skeleton width={40} height={40} className="mr-4" borderRadius={12} />
                          <div className="flex-1">
                            <Skeleton width={80} height={10} className="mb-1" />
                            <Skeleton width={150} height={18} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
    
                {/* Right Side: Quick Menu Skeleton */}
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <Skeleton width={100} height={20} className="mb-4 px-2" />
                    <div className="space-y-4">
                      <Skeleton height={45} borderRadius={12} count={3} />
                      <hr className="my-3 border-slate-100" />
                      <Skeleton height={45} borderRadius={12} />
                    </div>
                  </div>
    
                  {/* Support Box Skeleton */}
                  <div className="bg-blue-100 rounded-3xl p-6">
                    <Skeleton width={100} height={20} className="mb-2" />
                    <Skeleton count={2} className="mb-4" />
                    <Skeleton height={40} borderRadius={12} />
                  </div>
                </div>
    
              </div>
            </div>
          </div>
        </SkeletonTheme>
  );

  if (!user) return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center">
      <p className="text-sm font-bold text-gray-500">Redirecting to login...</p>
    </div>  
  ) // ইউজার না থাকলে কিছু দেখাবে না, জাস্ট রিডাইরেক্ট হবে

  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-12 font-sans">
      {/* Header Blue Section */}
      <div className="h-64 bg-gradient-to-r from-blue-700 to-indigo-800 relative">
        <div className="absolute -bottom-16 left-0 right-0 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-2xl">
              <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                <User className="h-16 w-16 text-slate-400" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg hover:bg-blue-700 transition-all active:scale-90">
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user?.name}</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Verified Customer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                Account Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-center p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-4 text-slate-400">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider leading-none mb-1">Full Name</p>
                    <p className="text-slate-800 font-bold">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-4 text-slate-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider leading-none mb-1">Email Address</p>
                    <p className="text-slate-800 font-bold">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-4 text-slate-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider leading-none mb-1">Living Address</p>
                    <p className="text-slate-800 font-bold">{user?.address || "Update your address"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Quick Menu</h3>
              <nav className="space-y-1">
                <button onClick={()=>router.push('/my-orders')} className="w-full flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl transition-all group">
                  <div className="flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-600" />
                    <span className="text-slate-600 font-bold group-hover:text-slate-900">My Orders</span>
                  </div>
                </button>
               
                <hr className="my-3 border-slate-100" />
                <button
                  type="button" 
                  onClick={handleLogout}
                  className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-black uppercase text-xs tracking-tighter"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout Account
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}