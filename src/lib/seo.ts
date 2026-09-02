import { site } from '@/content/site';
import { locales, localeTags, routing, type Locale } from '@/i18n/routing';

/** `/`, `/pt`, `/es` — matches routing.localePrefix = 'as-needed'. */
export function localePath(locale: Locale, path = '') {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  const joined = `${prefix}${path}`;
  return joined === '' ? '/' : joined;
}

export function absolute(locale: Locale, path = '') {
  return new URL(localePath(locale, path), site.url).toString();
}

/**
 * Canonical plus a full hreflang set. `x-default` points at English, the
 * default locale, which is what an unmatched visitor is served.
 */
export function alternates(locale: Locale, path = '') {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeTags[l]] = localePath(l, path);
  languages['x-default'] = localePath(routing.defaultLocale, path);

  return {
    canonical: localePath(locale, path),
    languages,
  };
}
