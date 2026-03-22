import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const adminAuth = request.cookies.get('adminAuth');

  // If user is trying to access admin pages
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If not authenticated, redirect to login
    if (!adminAuth || adminAuth.value !== 'true') {
      const loginUrl = new URL('/login', request.url);
      // Optional: keep the original URL to redirect back after login
      // loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is already authenticated and trying to access login page
  if (request.nextUrl.pathname === '/login') {
    if (adminAuth && adminAuth.value === 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
