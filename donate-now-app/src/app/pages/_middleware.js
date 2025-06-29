// pages/_middleware.js
import { NextResponse } from 'next/server';
import { getAuthToken } from '../utils/auth';

export function middleware(request) {
  const token = getAuthToken();
  const { pathname } = request.nextUrl;

  // List of protected routes
  const protectedRoutes = ['/dashboard', '/profile'];

  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from login/register if they try to access them
  if (token && ['/login', '/register'].includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}