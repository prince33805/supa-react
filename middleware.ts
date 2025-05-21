import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // console.log('🔐 Running middleware for:', request.nextUrl.pathname);

  try {
    const { supabase, response } = createClient(request);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // console.log('🔒 User not logged in, redirecting...');
      return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
  } catch (error) {
    console.error('❌ Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/product', '/dashboard', '/order'],
};
