'use client';
import { useState, useEffect } from 'react';

export default function Scrollbar() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`/api/posts?t=${Date.now()}`, { cache: 'no-store' });
        const productsData = await response.json();

        if (productsData.success && productsData.data) {
          // Prothom 5-ti image slice kora holo
          const firstFiveImages = productsData.data.slice(0, 5).map(p => p.imgUrl);
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

  // Infinite loop maintain korar jonno amra 5-ti image ke double (10-ti) korbo
  const scrollList = [...images, ...images];

  return (
    <div className="w-full py-10 bg-white overflow-hidden">
      <div className="relative flex group overflow-hidden">
        
        {/* Left and Right Fade effect (Premium Look) */}
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
                alt="product"
                className="w-full h-full object-cover rounded-2xl shadow-sm border border-slate-100"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* Custom Animation Keyframes */
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); } /* 12px hocche gap er ordhek */
        }

        .animate-infinite-scroll {
          display: flex;
          width: max-content;
          animation: scroll 25s linear infinite;
        }

        /* Mouse cursor image er opor nile animation paused hobe */
        .group-hover\:paused:hover {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
}