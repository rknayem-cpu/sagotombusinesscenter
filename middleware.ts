import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Cookie theke userId ber kora
  const userId = request.cookies.get('userId')?.value;

  // 2. Jei route-gulo check korte hobe
  const authRoutes = ['/login', '/register', '/verify'];
  
  // 3. Current URL path ber kora
  const { pathname } = request.nextUrl;

  // Logic: Jodi userId thake ebong user authRoutes-e jete chay
  if (userId && authRoutes.some(route => pathname.startsWith(route))) {
    // Take 'profile' route-e redirect korun
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Jodi userId na thake, tobe request normal-vabe cholte thakbe
  return NextResponse.next();
}

// 4. Kon kon route-e middleware kaj korbe sheta specify kora
export const config = {
  matcher: ['/login', '/register', '/verify'],
};
