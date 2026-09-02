import type { MetadataRoute } from 'next';
import { locales, localeTags, routing } from '@/i18n/routing';
import { featuredProjects } from '@/content/projects';
import { absolute } from '@/lib/seo';

/** Every sheet, in every language, with the full hreflang set on each entry. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', ...featuredProjects.map((p) => `/work/${p.slug}`)];

  const languages = (path: string) => ({
    ...Object.fromEntries(locales.map((l) => [localeTags[l], absolute(l, path)])),
    'x-default': absolute(routing.defaultLocale, path),
  });

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absolute(locale, path),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
      alternates: { languages: languages(path) },
    })),
  );
}
