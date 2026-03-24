"use client";

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProfileLoading() {
  return (
    // ফেসবুক বা আধুনিক অ্যাপের মতো হালকা গ্রে থিম
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
}