import { site } from '@/content/site';
import { localeTags, locales, type Locale } from '@/i18n/routing';
import { absolute } from '@/lib/seo';

/**
 * Structured data, built only from facts already on the page.
 *
 * Nothing here is a claim the visible site does not make: the same name, role,
 * channels, languages and technologies, in the vocabulary a search engine and
 * an AI assistant can read. No ratings, no counts, no employer or client
 * relationships beyond the one Ryan states himself.
 */

const escape = (data: unknown) => JSON.stringify(data).replace(/</g, '\u003c');

function person(locale: Locale) {
  return {
    '@type': 'Person',
    '@id': `${site.url}/#ryan`,
    name: site.name,
    url: absolute(locale),
    email: `mailto:${site.email}`,
    jobTitle: 'Full-Stack Developer',
    description: site.headline,
    sameAs: [site.links.linkedin, site.links.github],
    worksFor: {
      '@type': 'Organization',
      name: 'Voltz Agency',
    },
    knowsLanguage: locales.map((l) => localeTags[l]),
    knowsAbout: [
      'Custom CRM development',
      'ERP development',
      'E-commerce development',
      'Compliance platforms',
      'React',
      'Vite',
      'Supabase',
      'Next.js',
      'TypeScript',
      'SQL',
      'PHP',
      'Laravel',
      'Firebird',
    ],
  };
}

export function HomeJsonLd({
  locale,
  description,
}: {
  locale: Locale;
  description: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      person(locale),
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: absolute(locale),
        name: site.name,
        description,
        inLanguage: localeTags[locale],
        publisher: { '@id': `${site.url}/#ryan` },
      },
      {
        '@type': 'ProfilePage',
        url: absolute(locale),
        name: `${site.name} — ${site.headline}`,
        description,
        inLanguage: localeTags[locale],
        mainEntity: { '@id': `${site.url}/#ryan` },
        isPartOf: { '@id': `${site.url}/#website` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escape(data) }}
    />
  );
}

export function CaseJsonLd({
  locale,
  name,
  description,
  path,
  liveUrl,
  homeLabel,
}: {
  locale: Locale;
  name: string;
  description: string;
  path: string;
  liveUrl: string;
  homeLabel: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      person(locale),
      {
        '@type': 'CreativeWork',
        name,
        description,
        url: absolute(locale, path),
        inLanguage: localeTags[locale],
        author: { '@id': `${site.url}/#ryan` },
        creator: { '@id': `${site.url}/#ryan` },
        about: { '@type': 'WebSite', name, url: liveUrl },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: homeLabel,
            item: absolute(locale),
          },
          { '@type': 'ListItem', position: 2, name },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escape(data) }}
    />
  );
}
