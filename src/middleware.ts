import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * On the preview deployment, the front door is the concept lab.
 *
 * This lives in middleware rather than next.config's `redirects()` because
 * that list is baked into the route manifest at build time, and Railway's
 * service variables are injected at runtime — a Dockerfile build never sees
 * them unless they're declared as build args. Middleware reads process.env
 * per request, so the guard actually works.
 *
 * Without LAB_PREVIEW set (i.e. production), this is a no-op, so merging the
 * branch can never redirect itairotem.com away from its own homepage.
 */
export function middleware(request: NextRequest) {
  if (process.env.LAB_PREVIEW === '1') {
    return NextResponse.redirect(new URL('/lab', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: '/' };
