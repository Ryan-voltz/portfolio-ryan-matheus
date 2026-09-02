import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Archivo, Martian_Mono } from 'next/font/google';

import '../globals.css';
import { routing, localeTags, type Locale } from '@/i18n/routing';
import { site } from '@/content/site';
import { absolute, alternates } from '@/lib/seo';

// `latin` alone covers every character these three languages set: Portuguese
// and Spanish diacritics all live in Latin-1 Supplement (U+00C0-00FF), so the
// `latin-ext` file was a whole font download nothing on the site rendered.
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
  // The largest text on the page is set in this face, so it is the LCP font.
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  adjustFontFallback: true,
});

// Martian Mono only ever sets 11px labels, dimensions and codes — never the
// LCP text — so it is kept off the critical path. It swaps in a beat later
// against a metric-matched fallback instead of delaying first paint by ~88kB.
const martian = Martian_Mono({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-martian',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
});

/**
 * DIRECTION CONTRACT — kept in the emitted markup so the built page can be
 * audited against the decision that produced it.
 */
const CONTRACT = `<!--
THESIS: This portfolio is the general-arrangement drawing of the systems Ryan builds, and one dimension chain measures the whole delivery under a single name. It refuses the dev-portfolio hero-plus-card-grid.
OWN-WORLD: Cool vellum/graphite sheet, drafting redline as the sole accent. Hairline rules, dimension chains, section callout bubbles, mounted details with registration ticks, schedule tables, a title block. Archivo semi-condensed lettering; Martian Mono for dimensions, codes and status.
STORY: A buyer sees who drew this, sees eight systems live with their addresses, and writes.
FIRST VIEWPORT: Bordered sheet over a faint construction grid. Name at drawing scale top-left with the pinned headline and lead beneath; the sheet index and the title-block cartouche close the right column, cartouche last; the four-stage delivery chain measured across the full measure with a redline overall bracket naming one author; the single red action plate anchored bottom-left, where every left-set line above it ends and a Persuade visitor's scan actually arrives.
FORM: General Arrangement — candidate 4 of 7 on the grounded list; seed key 076c60c5.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
-->`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // The sheet frame and the docked issue bar reach the physical screen edges,
  // so the page has to own the area under the notch and the home indicator.
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#eff1f2' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1315' },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${t('titleSuffix')}`,
      template: `%s — ${site.name}`,
    },
    description: t('description'),
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    alternates: alternates(locale as Locale),
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${site.name} — ${t('titleSuffix')}`,
      description: t('description'),
      url: absolute(locale as Locale),
      locale: localeTags[locale as Locale].replace('-', '_'),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${site.name} — ${t('titleSuffix')}`,
      description: t('description'),
    },
    robots: { index: true, follow: true },
    // The site already ships real, authored translations in EN/PT/ES with
    // correct hreflang alternates and a visible language switcher — Chrome's
    // "Translate this page?" prompt only offers a worse, machine-translated
    // copy of a page the visitor can already read natively. Opting out here
    // is the standard fix for a properly localized site.
    other: { google: 'notranslate' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={localeTags[locale as Locale]} className={`${archivo.variable} ${martian.variable}`}>
      <body>
        <div hidden aria-hidden dangerouslySetInnerHTML={{ __html: CONTRACT }} />
        {/* Without JavaScript the reveal observer never runs, so the rules would
            stay drawn to zero width. Text is never gated on it — only the rules. */}
        <noscript>
          <style>{'.draws{transform:none!important}.marks{transform:none!important}'}</style>
        </noscript>
        {/* No client component on this site calls `useTranslations` — the
            switcher needs only `useLocale`, and everything else takes its
            copy as props from a server component. Passing an empty message
            set keeps the whole locale dictionary (including every case-page
            paragraph) out of the HTML and the RSC payload of every route. */}
        <NextIntlClientProvider messages={{}}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
