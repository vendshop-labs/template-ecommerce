import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Drives locale negotiation off the shared `routing` config — the same object
// used by the navigation helpers, so prefixing never drifts. All six locales
// are routable; REGION_BUNDLE does not affect routing.
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except API routes, Next.js internals, and files with an
  // extension (e.g. favicon.ico).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
