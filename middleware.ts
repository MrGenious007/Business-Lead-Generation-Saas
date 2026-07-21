import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requiresAuthentication } from '@/lib/rbac';

function hasSupabaseSessionCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some(({ name }) => name === 'sb-access-token' || name.startsWith('sb-') || name.startsWith('__Secure-sb-'));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = requiresAuthentication(pathname);

  if (isProtectedRoute) {
    if (!hasSupabaseSessionCookie(request)) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)'],
};
