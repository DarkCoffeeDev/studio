import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware redirects the root path to /dashboard.
// Route protection is handled client-side in the (app) layout.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
}
