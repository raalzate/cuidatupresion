import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (image files)
     * - icons/ (PWA icons)
     * - sign-in (authentication route)
     * - manifest.json (PWA manifest)
     * - sw.js (PWA service worker)
     * - firebase-messaging-sw.js (Firebase service worker)
     * - workbox-*.js (Workbox files)
     * - / (the root route)
     *
     * This is to protect all routes by default, while keeping public assets
     * and authentication pages accessible.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|sign-in|manifest.json|sw.js|firebase-messaging-sw.js|workbox-.*\\.js|$).*)',
  ],
};
