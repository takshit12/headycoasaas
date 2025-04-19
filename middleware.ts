import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * Uncomment the following code to enable authentication with Clerk
 */

const isProtectedRoute = createRouteMatcher(['/dashboard']) // Use '/dashboard' as an example protected route

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) {
      // Handle protected routes check here
      // If user is not authenticated, redirect to sign-in
      auth.protect();
    }

    return NextResponse.next()
})  

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|api/webhooks).*)",
  ],
}
