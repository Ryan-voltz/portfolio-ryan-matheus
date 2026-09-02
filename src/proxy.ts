import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

// Next 16 renamed the `middleware` file convention to `proxy`; next-intl's
// handler is an ordinary request handler, so it slots straight in.
export default createMiddleware(routing);

export const config = {
  // Everything except Next internals, the API surface, generated metadata
  // routes, and any path carrying a file extension.
  //
  // Next's generated metadata routes (`icon`, `apple-icon`, `opengraph-image`)
  // are extensionless, so without naming them here the locale negotiator tries
  // to prefix them and the browser gets a 404 where the favicon should be.
  // `opengraph-image` matters twice over: its route lives under [locale], so
  // the English card at /en/opengraph-image would otherwise answer with a 307,
  // and a crawler that does not follow redirects would show no link preview.
  //
  // The extension test is written `[.]` rather than as an escaped dot: this
  // string is the source of a regex, and a lone backslash here is one bad
  // copy away from becoming `.`, which silently matches every path and turns
  // the whole negative lookahead into "skip everything".
  matcher:
    '/((?!api|_next|_vercel|icon|apple-icon|.*opengraph-image.*|.*twitter-image.*|manifest|sitemap|robots|.*[.].*).*)',
};
