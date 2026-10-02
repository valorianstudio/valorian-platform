import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'valorian_session';
const CLIENT_COOKIE = 'valorian_client';

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Client portal: its own cookie and its own login. An admin session never grants portal access.
  if (pathname.startsWith('/client')) {
    if (!request.cookies.has(CLIENT_COOKIE) && pathname !== '/client/login') return NextResponse.redirect(new URL('/client/login', request.url));
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(SESSION_COOKIE);
  const isLogin = pathname === '/admin/login';

  if (!hasSession && !isLogin) return NextResponse.redirect(new URL('/admin/login', request.url));

  // Lets server layouts see the requested path so they can enforce page-level permissions.
  const headers = new Headers(request.headers);
  headers.set('x-pathname', pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ['/admin/:path*', '/client/:path*'] };
