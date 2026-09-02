import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { site } from '@/content/site';
import LocaleSwitcher from './LocaleSwitcher';
import { ArrowRight } from './Icons';

const sections = [
  { href: '/#about', key: 'about' },
  { href: '/#work', key: 'work' },
  { href: '/#projects', key: 'projects' },
  { href: '/#contact', key: 'contact' },
] as const;

/** The top edge of the sheet: who drew it, what language it reads in, how to write back. */
export default async function Header() {
  const t = await getTranslations('nav');

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--rule)] bg-[var(--sheet)]/94 backdrop-blur-[6px]">
      <div className="sheet">
        <div className="flex h-14 items-center justify-between gap-4 md:h-16">
          <Link
            href="/"
            className="group flex items-baseline gap-3 no-underline"
            aria-label={t('home')}
          >
            <span className="u-display text-[1.0625rem] tracking-[-0.02em] md:text-[1.1875rem]">
              Ryan Matheus
            </span>
            <span className="u-label hidden sm:inline" aria-hidden>
              {site.drawingNumber}
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-5">
            <nav aria-label={t('sections')} className="hidden lg:block">
              <ul className="flex items-center gap-6">
                {sections.map((s) => (
                  <li key={s.key}>
                    <Link href={s.href} className="u-tag u-tag-ink hover:text-[var(--red-ink)] transition-colors duration-200 no-underline">
                      {t(s.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <LocaleSwitcher label={t('language')} />

            <a
              href={`mailto:${site.email}`}
              className="u-tag hidden items-center gap-2 border border-[var(--red)] px-3 py-[0.4rem] text-[var(--red-ink)] no-underline transition-colors duration-200 hover:bg-[var(--red)] hover:text-[var(--plate-ink)] md:inline-flex"
            >
              {t('write')}
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile wayfinding: the same stations, on one scrollable strip. */}
      <nav aria-label={t('sections')} className="border-t border-[var(--rule)] lg:hidden">
        <div className="sheet">
          <ul className="-mx-1 flex items-center gap-5 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map((s) => (
              <li key={s.key} className="shrink-0 px-1">
                <Link href={s.href} className="u-tag u-tag-ink no-underline">
                  {t(s.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
