"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import * as fbq from "@/lib/fpixel";

export default function FacebookPixelEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // যখনই pathname বা searchParams পরিবর্তন হবে, তখনই PageView ট্র্যাক হবে
    fbq.pageview();
  }, [pathname, searchParams]);

  return null; // এটি স্ক্রিনে কিছু দেখাবে না
}