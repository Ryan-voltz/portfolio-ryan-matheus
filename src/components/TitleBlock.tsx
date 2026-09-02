import { getTranslations } from 'next-intl/server';
import { site } from '@/content/site';
import { localeNames, locales } from '@/i18n/routing';

/**
 * The footer is the drawing's title block: who drew it, which sheet this is,
 * what revision it carries, and how to reach the author. On a real sheet this
 * block is the one thing that is never decoration.
 */
export default async function TitleBlock({ sheet }: { sheet: string }) {
  const t = await getTranslations('titleBlock');

  const cells = [
    { label: t('drawnBy'), value: site.name, sub: site.headline },
    { label: t('drawing'), value: site.drawingNumber, sub: site.domain },
    { label: t('sheet'), value: `${sheet} / 0${site.sheetCount}`, sub: t('rev', { rev: site.revision }) },
    {
      label: t('contact'),
      value: site.email,
      href: `mailto:${site.email}`,
      sub: locales.map((l) => localeNames[l]).join(' · '),
    },
  ];

  return (
    <footer className="pb-10 pt-6 md:pt-10">
      <div className="sheet">
        <div className="tb grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cells.map((cell) => (
            <div key={cell.label} className="tb-cell">
              <p className="u-label">{cell.label}</p>
              <p className="mt-2 truncate text-[0.9375rem] font-medium tracking-[-0.01em]">
                {cell.href ? (
                  <a href={cell.href} className="u-link">
                    {cell.value}
                  </a>
                ) : (
                  cell.value
                )}
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-snug text-[var(--ink-3)]">{cell.sub}</p>
            </div>
          ))}
        </div>

        <p className="u-tag mt-5 normal-case tracking-[0.06em]">
          {t('copyright', { year: new Date().getFullYear(), name: site.name })}
        </p>
      </div>
    </footer>
  );
}
