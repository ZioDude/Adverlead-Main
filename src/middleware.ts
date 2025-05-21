import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Check auth condition
  if (session) {
    // If the user is signed in and tries to access auth pages, redirect them to dashboard
    if (request.nextUrl.pathname.startsWith('/login') || 
        request.nextUrl.pathname.startsWith('/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // If the user is not signed in and tries to access protected pages, redirect them to login
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}; 