import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { site } from '@/content/site';
import LocaleSwitcher from './LocaleSwitcher';
import SheetNav, { type Station } from './SheetNav';
import { ArrowRight } from './Icons';

const sections = [
  { href: '/#about', key: 'about' },
  { href: '/#work', key: 'work' },
  { href: '/#projects', key: 'projects' },
  { href: '/#contact', key: 'contact' },
] as const;

/**
 * The top edge of the sheet: who drew it, what language it reads in, how to
 * write back — and, below 1280px, the dimension strip that says where in the
 * sheet you are.
 *
 * The bar is opaque rather than frosted: a drawing has no glass, and a
 * backdrop filter is the most expensive thing a phone paints while scrolling.
 */
export default async function Header({ stations }: { stations: Station[] }) {
  const t = await getTranslations('nav');

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--rule)] bg-[var(--sheet)]">
      <div className="sheet">
        <div className="flex h-[var(--bar-h)] items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-baseline gap-3 no-underline"
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
                    <Link
                      href={s.href}
                      className="u-tag u-tag-ink no-underline transition-colors duration-200 hover:text-[var(--red-ink)]"
                    >
                      {t(s.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <LocaleSwitcher label={t('language')} />

            <a
              href={`mailto:${site.email}`}
              className="u-tag hidden items-center gap-2 border border-[var(--red)] px-3 py-[0.45rem] text-[var(--red-ink)] no-underline transition-colors duration-200 hover:bg-[var(--red)] hover:text-[var(--plate-ink)] md:inline-flex"
            >
              {t('write')}
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Mounted once: it renders the ≥1280px station rail (fixed, out in the
          filing margin) and the dimension strip below that, off one listener. */}
      <SheetNav stations={stations} label={t('sections')} />
    </header>
  );
}
