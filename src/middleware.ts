import { NextRequest, NextResponse } from 'next/server';

// Paths that don't require authentication
const publicPaths = ['/admin/login'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Add current path to headers for server components
    const response = NextResponse.next({
        request: {
            headers: new Headers(request.headers),
        },
    });
    response.headers.set('x-pathname', pathname);

    // Only apply auth middleware to admin routes
    if (!pathname.startsWith('/admin')) {
        return response;
    }

    // Allow access to public paths
    if (publicPaths.includes(pathname)) {
        return response;
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
        const authResponse = await fetch(new URL('/api/auth', request.url), {
            headers: {
                Cookie: `auth=${authCookie.value}`,
            },
        });

        const data = await authResponse.json();

        if (!data.authenticated) {
            const url = new URL('/admin/login', request.url);
            return NextResponse.redirect(url);
        }
    } catch (error) {
        console.error('Auth verification error:', error);
        const url = new URL('/admin/login', request.url);
        return NextResponse.redirect(url);
    }

    return response;
}

// Configure middleware to run on all routes
export const config = {
    matcher: [
        // Apply to all routes
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
