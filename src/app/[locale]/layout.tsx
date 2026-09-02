import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Archivo, Martian_Mono } from 'next/font/google';

import '../globals.css';
import { routing, localeTags, type Locale } from '@/i18n/routing';
import { site } from '@/content/site';
import { absolute, alternates } from '@/lib/seo';

const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const martian = Martian_Mono({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-martian',
  display: 'swap',
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
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
