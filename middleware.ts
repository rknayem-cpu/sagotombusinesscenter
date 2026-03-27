import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ১. কুকি থেকে ডাটা বের করা
  const userId = request.cookies.get('userId')?.value;
  const adminToken = request.cookies.get('admin_token')?.value;

  // ২. রুট লিস্ট তৈরি
  const authRoutes = ['/login', '/register', '/verify'];
  const adminProtectedRoutes = ['/admin/addpost', '/admin/orders', '/admin/posts'];

  // --- লজিক ১: সাধারণ ইউজার লগইন থাকলে রিডাইরেক্ট ---
  if (userId && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // --- লজিক ২: অ্যাডমিন রুট প্রটেকশন ---
  // যদি ইউজার অ্যাডমিন রুটে যেতে চায় কিন্তু টোকেন না থাকে
  if (adminProtectedRoutes.some(route => pathname.startsWith(route))) {
    if (!adminToken) {
      // তাকে অ্যাডমিন লগইন পেজে পাঠিয়ে দিন
      return NextResponse.redirect(new URL('/login-admin', request.url));
    }
  }

  return NextResponse.next();
}

// ৪. কনফিগারেশনে অ্যাডমিন রুটগুলোও যোগ করা হয়েছে
export const config = {
  matcher: [
    '/login', 
    '/register', 
    '/verify', 
    '/admin/addpost', 
    '/admin/orders', 
    '/admin/posts'
  ],
};