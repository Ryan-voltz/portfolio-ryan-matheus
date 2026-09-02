import { getTranslations } from 'next-intl/server';
import { site } from '@/content/site';
import { localeNames, locales } from '@/i18n/routing';

/**
 * The footer is the drawing's title block: who drew it, where it lives, how to
 * reach the author, and whether he is taking work. The sheet number was
 * dropped from it — a buyer closing the page needs the facts that decide a
 * contact, not the drawing's own filing metadata. The revision date stays, as
 * the sub-line that says how current the sheet is.
 */
export default async function TitleBlock() {
  const t = await getTranslations('titleBlock');
  const h = await getTranslations('home');

  const cells = [
    { label: t('drawnBy'), value: site.name, sub: site.headline },
    { label: t('drawing'), value: site.drawingNumber, sub: site.domain },
    {
      label: t('contact'),
      value: site.email,
      href: `mailto:${site.email}`,
      sub: locales.map((l) => localeNames[l]).join(' · '),
    },
    {
      label: t('status'),
      value: h('meta.status'),
      accent: true,
      sub: t('rev', { rev: site.revision }),
    },
  ];

  return (
    <footer className="pb-10 pt-6 md:pt-10">
      <div className="sheet">
        <div className="tb grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cells.map((cell) => (
            <div key={cell.label} className="tb-cell">
              <p className="u-label">{cell.label}</p>
              <p
                className={`mt-2 flex items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em] ${
                  cell.accent ? 'text-[var(--red-ink)]' : ''
                }`}
              >
                {cell.accent ? <span className="rev-tri shrink-0" aria-hidden /> : null}
                {cell.href ? (
                  <a href={cell.href} className="u-link min-w-0 truncate">
                    {cell.value}
                  </a>
                ) : (
                  <span className="min-w-0 truncate">{cell.value}</span>
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
