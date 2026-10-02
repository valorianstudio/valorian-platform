import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'valorian_session';

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const isLogin = pathname === '/admin/login';

  if (!hasSession && !isLogin) return NextResponse.redirect(new URL('/admin/login', request.url));
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
