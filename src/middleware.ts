import { NextRequest, NextResponse } from 'next/server';
// import { baseUrl } from '@/lib/utils';
import { cookies } from 'next/headers';

// 1. Specify protected and public routes
const protectedRoutes = ['/home', '/search', '/albums', '/archive'];
const publicRoutes = ['/login', '/register', '/'];

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path);

    // 3. Get the tokens
    const refreshToken = (await cookies()).get('refresh_token')?.value || null;
    // Access token is stored in localStorage in the browser but not accessible in middleware
    // We need to get it from a cookie if we want to check it server-side
    // const accessToken = req.cookies.get('access_token')?.value;
    //   const accessToken = localStorage.getItem('access_token');

    // 4. Handle routing based on authentication state
    if (isProtectedRoute) {
        // If no tokens exist, redirect to login
        if (!refreshToken) {
            (await cookies()).delete('access_token');
            (await cookies()).delete('refresh_token');
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
        // If refresh token exists, proceed to the page; client will handle access token
        return NextResponse.next();
    }

    // For public routes, if user is already authenticated, redirect to home
    if (isPublicRoute && (refreshToken) &&
        !req.nextUrl.pathname.startsWith('/home')) {
        return NextResponse.redirect(new URL('/home', req.nextUrl));
    }

    return NextResponse.next();
}
