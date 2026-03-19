import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col
     items-center justify-center bg-gray-50 px-4 text-center">
      {/* বড় করে ৪০৪ এনিমেশন বা স্টাইল */}
      <h1 className="text-9xl
       font-extrabold text-blue-600 
       tracking-widest animate-bounce  mt-20">
        404
      </h1>
      

      {/* টেক্সট কন্টেন্ট */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-800 md:text-4xl mb-4">
          দুঃখিত! আমরা পথ হারিয়ে ফেলেছি।
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          আপনি যে পেজটি খুঁজছেন সেটি হয়তো মুছে ফেলা হয়েছে অথবা এর নাম পরিবর্তন করা হয়েছে। 
          একবার হোম পেজটি চেক করে দেখতে পারেন।
        </p>

        {/* ব্যাক টু হোম বাটন */}
        <Link 
          href="/" 
          className="inline-block px-8 py-3 text-white font-semibold bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>

      {/* ডেকোরেশন */}
      <div className="mt-12 text-gray-400">
        <svg
          className="w-24 h-24 mx-auto opacity-20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  );
}
