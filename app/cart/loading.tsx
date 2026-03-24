"use client";

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function CartLoading() {
  return (
    <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
      <div className="min-h-screen bg-slate-50/50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          
         
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <Skeleton circle width={40} height={40} />
              <Skeleton width={250} height={40} borderRadius={10} />
            </div>
            <Skeleton width={150} height={20} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Side: Cart Items Skeleton (Showing 3 items) */}
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex gap-6 items-center shadow-sm">
                  {/* Product Image Skeleton */}
                  <Skeleton width={96} height={96} borderRadius={16} />

                  <div className="flex-1">
                    {/* Title and Size */}
                    <Skeleton width="60%" height={20} className="mb-2" />
                    <Skeleton width="30%" height={15} />
                    {/* Price */}
                    <Skeleton width="20%" height={25} className="mt-4" />
                  </div>

                  {/* Quantity Controls Skeleton */}
                  <div className="w-24">
                    <Skeleton height={40} borderRadius={12} />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side: Order Summary Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 sticky top-24">
                <Skeleton width={150} height={25} className="mb-6" />
                
                <div className="space-y-4 border-b border-slate-100 pb-6 mb-6">
                  <div className="flex justify-between">
                    <Skeleton width={80} />
                    <Skeleton width={60} />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton width={80} />
                    <Skeleton width={40} />
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <Skeleton width={100} height={15} />
                  <Skeleton width={100} height={40} />
                </div>

                {/* Checkout Button Skeleton */}
                <Skeleton height={60} borderRadius={16} />
                
                <div className="mt-6 flex justify-center">
                  <Skeleton width={120} height={10} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}