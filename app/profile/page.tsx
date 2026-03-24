"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Mail, MapPin, LogOut, Loader2,
  Settings, ShoppingBag, ShieldCheck, Edit3
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  // Profile data fetch kora
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: 'no-store' // Cache bondho rakha bhalo
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        router.push("/login");
      }
    };
    fetchProfile();
  }, [router]);

  // --- LOGOUT LOGIC (FIXED) ---
  const handleLogout = async () => {
    try {
      // 1. Prothome server-ke logout request pathaw
      const res = await fetch("/api/logout", { 
        method: "POST",
        cache: 'no-store' 
      });
      
      if (res.ok) {
        // 2. Server success korle ekhon Navbar & Cart-ke signal dao
        window.dispatchEvent(new Event('authChange'));
        window.dispatchEvent(new Event('cartUpdated'));
        
        // 3. Ekhon redirect koro
        router.push("/login");
        router.refresh(); // Next.js server components refresh korar jonno
      }
    } catch (err) {
      console.error("Logout failed:", err);
      // Error holeo UI safety-r jonno redirect kora bhalo
      router.push("/login");
    }
  };

  

  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-12">
      {/* Header Blue Section */}
      <div className="h-64 bg-gradient-to-r from-blue-700 to-indigo-800 relative">
        <div className="absolute -bottom-16 left-0 right-0 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-2xl">
              <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                <User className="h-16 w-16 text-slate-400" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg hover:bg-blue-700 transition-all">
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">{user?.name}</h1>
          <p className="text-slate-500 font-medium">Verified Customer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
                Personal Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-center p-4 bg-slate-50 rounded-2xl group transition-all hover:bg-blue-50">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-4 group-hover:text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Full Name</p>
                    <p className="text-slate-700 font-semibold">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-slate-50 rounded-2xl group transition-all hover:bg-blue-50">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-4 group-hover:text-blue-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                    <p className="text-slate-700 font-semibold">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-slate-50 rounded-2xl group transition-all hover:bg-blue-50">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-4 group-hover:text-blue-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Living Address</p>
                    <p className="text-slate-700 font-semibold">{user?.address || "No address added yet"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Quick Menu</h3>
              <nav className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group">
                  <div className="flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-600" />
                    <span className="text-slate-600 font-medium group-hover:text-slate-900">My Orders</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group">
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-600" />
                    <span className="text-slate-600 font-medium group-hover:text-slate-900">Settings</span>
                  </div>
                </button>
                <hr className="my-3 border-slate-100" />
                <button
                  type="button" 
                  onClick={handleLogout}
                  className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}