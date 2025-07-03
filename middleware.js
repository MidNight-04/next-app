import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

function clearAuthCookies(response) {
  response.cookies.set('next-auth.session-token', '', {
    expires: new Date(0),
    path: '/',
  });
  response.cookies.set('__Secure-next-auth.session-token', '', {
    expires: new Date(0),
    path: '/',
  });
}

export default async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = ['/admin'].some(path => pathname.startsWith(path));
  if (!isProtectedRoute) return NextResponse.next();

  const token = await getToken({ req: request });

  if (!token || (token.exp && Date.now() >= token.exp * 1000)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('callbackUrl', pathname);

    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
