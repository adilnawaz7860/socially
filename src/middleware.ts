import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // ✅ Protect all app pages (excluding static files and Next.js internals)
    '/((?!_next|favicon.ico|.*\\..*).*)',
    // ✅ Explicitly protect all API routes
    '/api/(.*)',
  ],
};
