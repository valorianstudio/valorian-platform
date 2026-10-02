import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'valorian_session';

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const isLogin = pathname === '/admin/login';

  if (!hasSession && !isLogin) return NextResponse.redirect(new URL('/admin/login', request.url));

  // Lets server layouts see the requested path so they can enforce page-level permissions.
  const headers = new Headers(request.headers);
  headers.set('x-pathname', pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ['/admin/:path*'] };
