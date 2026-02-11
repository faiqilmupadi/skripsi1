import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const key = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret');

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/kepala-gudang')) return NextResponse.next();

  const token = req.cookies.get('session')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const { payload } = await jwtVerify(token, key);
    if (pathname.startsWith('/admin') && payload.role !== 'admin_gudang') return NextResponse.redirect(new URL('/login', req.url));
    if (pathname.startsWith('/kepala-gudang') && payload.role !== 'kepala_gudang') return NextResponse.redirect(new URL('/login', req.url));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/kepala-gudang/:path*'],
};
