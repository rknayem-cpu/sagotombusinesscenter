"use client";

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProductLoading() {
  return (
    <SkeletonTheme baseColor="#f1f5f9" highlightColor="#ffffff">
      <div className="min-h-screen bg-white py-12 px-4 md:px-8 mt-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Back Button Skeleton */}
          <div className="mb-8">
            <Skeleton width={150} height={20} borderRadius={8} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Image Gallery Skeleton (7 Columns) */}
            <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="w-20 h-24 rounded-xl overflow-hidden">
                    <Skeleton height="100%" />
                  </div>
                ))}
              </div>
              {/* Main Image Skeleton */}
              <div className="flex-1 rounded-[2rem] overflow-hidden">
                <Skeleton height={600} borderRadius="2rem" />
              </div>
            </div>

            {/* Right: Product Details Skeleton (5 Columns) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="mb-6 space-y-3">
                {/* Category Tag */}
                <Skeleton width={80} height={12} />
                {/* Title */}
                <Skeleton width="90%" height={50} />
                <Skeleton width="60%" height={50} />
                
                <div className="flex items-center gap-4 mt-6">
                  {/* Price */}
                  <Skeleton width={100} height={40} />
                  {/* Rating Badge */}
                  <Skeleton width={120} height={30} borderRadius={10} />
                </div>
              </div>

              <div className="space-y-8 mt-10">
                {/* Description Skeleton */}
                <div>
                  <Skeleton width={100} height={15} className="mb-3" />
                  <Skeleton count={3} />
                </div>

                {/* Size Selector Skeleton */}
                <div>
                  <Skeleton width={120} height={15} className="mb-4" />
                  <div className="flex gap-3">
                    <Skeleton width={60} height={45} borderRadius={12} />
                    <Skeleton width={60} height={45} borderRadius={12} />
                    <Skeleton width={60} height={45} borderRadius={12} />
                  </div>
                </div>

                {/* Button Skeleton */}
                <div className="pt-4">
                  <Skeleton height={64} borderRadius={16} />
                </div>

                {/* Trust Badges Skeleton */}
                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={35} height={35} />
                    <Skeleton width={80} height={10} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={35} height={35} />
                    <Skeleton width={80} height={10} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}