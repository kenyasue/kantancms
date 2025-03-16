import { NextRequest, NextResponse } from 'next/server';

// Paths that don't require authentication
const publicPaths = ['/admin/login'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only apply middleware to admin routes
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Allow access to public paths
    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    // Check for auth cookie
    const authCookie = request.cookies.get('auth');

    // If no auth cookie, redirect to login
    if (!authCookie?.value) {
        const url = new URL('/admin/login', request.url);
        return NextResponse.redirect(url);
    }

    // Verify the auth cookie by calling the auth API
    try {
        const response = await fetch(new URL('/api/auth', request.url), {
            headers: {
                Cookie: `auth=${authCookie.value}`,
            },
        });

        const data = await response.json();

        if (!data.authenticated) {
            const url = new URL('/admin/login', request.url);
            return NextResponse.redirect(url);
        }
    } catch (error) {
        console.error('Auth verification error:', error);
        const url = new URL('/admin/login', request.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Configure middleware to run only on admin routes
export const config = {
    matcher: '/admin/:path*',
};
