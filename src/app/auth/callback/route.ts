import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/dashboard';

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error.message);
        // Redirect to login with error message
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url));
      }

      // Successful verification
      return NextResponse.redirect(new URL(next, request.url));
    }

    // If no code is present, redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Error in auth callback:', error);
    // Redirect to login with generic error message
    return NextResponse.redirect(new URL('/login?error=An unexpected error occurred', request.url));
  }
} 