"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// Axios remove kora hoyeche
import { Lock, Mail, Loader2, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Native Fetch API use kora hoyeche
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Login success hole profile-e redirect
        router.push("/profile");
        router.refresh(); 
      } else {
        // Fetch-e error response manual dhorter hoy
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      setError("Something went wrong. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-100/50 overflow-hidden border border-white">
          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-200">
                <LogIn className="text-white h-8 w-8" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 mt-2 font-medium">Please enter your details to login</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 animate-in fade-in zoom-in duration-300">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-70 mt-4"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-600 font-bold hover:underline underline-offset-4">
                  Create for free
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
