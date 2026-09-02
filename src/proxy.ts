import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

// Next 16 renamed the `middleware` file convention to `proxy`; next-intl's
// handler is an ordinary request handler, so it slots straight in.
export default createMiddleware(routing);

export const config = {
  // Everything except Next internals, the API surface, generated metadata routes
  // and files with an extension.
  //
  // `opengraph-image` is excluded on purpose: the route lives under [locale], so
  // without this the English card at /en/opengraph-image would answer with a 307
  // to the unprefixed path, and a crawler that does not follow redirects would
  // show no link preview at all.
  matcher: '/((?!api|_next|_vercel|.*opengraph-image.*|.*\\..*).*)',
};
