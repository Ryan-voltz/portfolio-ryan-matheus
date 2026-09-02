'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { locales, localeNames, localeTags, type Locale } from '@/i18n/routing';

type Props = {
  label: string;
  className?: string;
};

/**
 * Three real links, not a dropdown: with three options a segmented control is
 * fewer interactions and stays keyboard-obvious. Each link points at the page
 * you are already on, so switching language never loses your place.
 *
 * Active state is carried by a mark — the bracket rule beneath the label —
 * as well as by colour, so it survives a monochrome print and colour blindness.
 */
export default function LocaleSwitcher({ label, className }: Props) {
  const active = useLocale() as Locale;
  // Locale-agnostic pathname: '/work/volare', never '/pt/work/volare'.
  const pathname = usePathname();

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-stretch border border-[var(--rule-strong)]">
        {locales.map((loc, i) => {
          const isActive = loc === active;
          return (
            <li key={loc} className={i > 0 ? 'border-l border-[var(--rule)]' : undefined}>
              <Link
                href={pathname}
                locale={loc}
                hrefLang={localeTags[loc]}
                aria-current={isActive ? 'true' : undefined}
                // Switching locale re-renders the whole [locale] tree because
                // the dynamic segment's param value changes, which Next reads
                // as "the entire route changed" — its scroll-into-view fallback
                // then walks body's children from the end and lands on the
                // footer. Only the visible text changes here, so the reader's
                // scroll position is exactly what should stay put.
                scroll={false}
                className="u-label relative block px-2.5 py-1.5 transition-colors duration-200 hover:text-[var(--ink)] data-[on=true]:text-[var(--red-ink)]"
                data-on={isActive}
              >
                {localeNames[loc]}
                <span
                  aria-hidden
                  className="absolute inset-x-1.5 bottom-[3px] h-px origin-left bg-[var(--red)] transition-transform duration-300"
                  style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
