import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'pt', 'es'] as const;
export type Locale = (typeof locales)[number];

/** Label shown in the header switcher and the title block. */
export const localeNames: Record<Locale, string> = {
  en: 'EN',
  pt: 'PT',
  es: 'ES',
};

/** `lang` / `hreflang` value emitted for each locale. */
export const localeTags: Record<Locale, string> = {
  en: 'en',
  pt: 'pt-BR',
  es: 'es',
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  // English lives at `/`, the others at `/pt` and `/es`.
  localePrefix: 'as-needed',
});
