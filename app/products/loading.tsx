"use client";

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProductsLoading() {
  return (
    <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
      <div className="max-w-7xl mx-auto mt-12 py-12 px-4">
        
        {/* Header Skeleton: New Drops. */}
        <header className="mb-10 text-center md:text-left">
          <Skeleton width={200} height={40} className="mb-2" />
          <Skeleton width={150} height={20} />
        </header>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {/* ৮টি কার্ড দেখাচ্ছি যাতে পুরো স্ক্রিন ভরে থাকে */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="rounded-xl border border-slate-100 p-2">
              
              {/* Image Box Skeleton */}
              <div className="relative aspect-[4/4] overflow-hidden rounded-xl">
                <Skeleton height="100%" containerClassName="flex-1" />
              </div>

              {/* Text and Button Skeleton */}
              <div className="mt-4 p-2 space-y-3">
                {/* Category Tag */}
                <Skeleton width={60} height={12} />
                
                {/* Title */}
                <Skeleton width="90%" height={18} />
                
                <div className="flex items-center justify-between mt-4">
                  {/* Price */}
                  <Skeleton width={50} height={20} />
                  
                  {/* Add Button */}
                  <Skeleton width={60} height={32} borderRadius={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}