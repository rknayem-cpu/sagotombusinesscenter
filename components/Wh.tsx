"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function Wh() {
  return (
    <div className="fixed bottom-6 right-6 md:bottom-6 md:right-6 z-50">
      {/* Soft Floating Animation */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Link
          href="https://wa.me/8801997219858"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-green-500/20
           blur-xl rounded-full group-hover:bg-green-500/40 transition-all duration-700" />

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative flex items-center 
            bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border 
            border-white/20 shadow-2xl rounded-full p-1.5 md:p-2"
          >
            {/* WhatsApp Icon Wrapper */}
            <div className="bg-gradient-to-tr from-[#25D366] to-[#128C7E] p-3 md:p-3 rounded-full shadow-md group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out">
              <FaWhatsapp className="text-white text-2xl md:text-3xl" />
            </div>

            {/* Responsive Text Logic */}
            {/* Mobile-e sudhu icon thakbe, MD screen (Tablet/Desktop) e text show hobe */}
            <div className="hidden md:flex flex-col ml-3 mr-4 overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-500 ease-in-out">
              <span className="text-[10px] uppercase tracking-[0.2em] text-green-600 font-bold leading-none">
                Online
              </span>
              <span className="text-gray-800 dark:text-gray-100 font-semibold text-sm whitespace-nowrap">
                Chat with us
              </span>
            </div>

            {/* Simple Online Dot (Mobile-e o thakbe) */}
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white dark:border-zinc-900"></span>
            </span>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}