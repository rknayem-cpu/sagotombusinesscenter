"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// Axios remove kora hoyeche
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return setError("Please enter the full code");

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Axios er bodole native fetch use kora hoyeche
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Verification successful! Redirecting...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        // Fetch logic: error response handling
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-white/50 backdrop-blur-sm">

        {/* Icon & Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Verify Identity</h2>
          <p className="text-slate-500 text-center mt-2 text-sm">
            We've sent a 4-digit code to <br />
            <span className="font-semibold text-slate-700">{email || "your email"}</span>
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center animate-pulse">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-3 bg-green-50 text-green-600 text-sm rounded-xl border border-green-100 text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center">
            <input
              type="text"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="0 0 0 0"
              className="w-48 text-center text-3xl font-bold tracking-[1rem] py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 4}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span>Verify & Complete</span>
            )}
          </button>
        </form>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to registration
          </button>

          <p className="text-xs text-slate-400">
            Didn't receive code? <span className="text-blue-600 cursor-pointer hover:underline font-medium">Resend Code</span>
          </p>
        </div>
      </div>
    </div>
  );
}
