'use client';
import { useState, useEffect } from 'react';

// ১. প্রোডাক্টের জন্য ইন্টারফেস তৈরি (Type Safety)
interface Product {
  imgUrl: string;
  [key: string]: any; // অন্যান্য ফিল্ড থাকতে পারে
}

interface ApiResponse {
  success: boolean;
  data: Product[];
}

export default function Scrollbar() {
  // ২. স্টেটের টাইপ ডিফাইন করা (string array)
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`/api/posts?t=${Date.now()}`, { cache: 'no-store' });
        const productsData: ApiResponse = await response.json();

        if (productsData.success && productsData.data) {
          // ৩. টাইপ ডিফাইন করায় এখন 'p' আর এরর দিবে না
          const firstFiveImages = productsData.data
            .slice(0, 5)
            .map((p: Product) => p.imgUrl);
          setImages(firstFiveImages);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading || images.length === 0) return null;

  const scrollList = [...images, ...images];

  return (
    <div className="w-full py-10 bg-white overflow-hidden">
      <div className="relative flex group overflow-hidden">
        
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-infinite-scroll group-hover:paused">
          {scrollList.map((img, i) => (
            <div
              key={i}
              className="w-[300px] h-[180px] flex-shrink-0 relative transition-transform duration-500 hover:scale-105"
            >
              <img
                src={img}
                alt={`product-${i}`}
                className="w-full h-full object-cover rounded-2xl shadow-sm border border-slate-100"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }

        .animate-infinite-scroll {
          display: flex;
          width: max-content;
          animation: scroll 25s linear infinite;
        }

        .group-hover\:paused:hover {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
}