import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Public routes — accessible without sign-in
const isPublicRoute = createRouteMatcher([
    '/',
    '/jobs(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
    '/success-stories(.*)',
    '/creator-guide(.*)',
    '/marketplace(.*)',
    '/unauthorized(.*)',
])

// Role-specific routes
const isEmployerRoute = createRouteMatcher([
    '/employer(.*)',
    '/api/employer(.*)',
])

const isJobSeekerRoute = createRouteMatcher([
    '/seeker(.*)',
    '/api/seeker(.*)',
])

export default clerkMiddleware(async (auth, req) => {
    // Allow public routes through without auth
    if (isPublicRoute(req)) return

    // Protect all non-public routes — redirect unauthenticated users to sign-in
    const { userId, sessionClaims } = await auth.protect()

    // Role-based route protection
    const role = (sessionClaims?.metadata as { role?: string })?.role

    if (isEmployerRoute(req) && role !== 'employer') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (isJobSeekerRoute(req) && role !== 'job_seeker') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
