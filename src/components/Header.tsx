import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { site, whatsappHref } from '@/content/site';
import HomeLink from '@/components/HomeLink';
import ThemeToggle from '@/components/ThemeToggle';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import SheetNav, { type Station } from '@/components/SheetNav';
import { WhatsApp } from '@/components/Icons';

export default async function Header({ stations }: { stations: Station[] }) {
  const t = await getTranslations('nav');

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--rule)] bg-[var(--sheet)] transition-colors duration-200">
      <div className="sheet">
        <div className="flex h-[var(--bar-h)] items-center justify-between gap-4">
          <HomeLink
            className="group flex items-center gap-3 no-underline"
            ariaLabel={t('home')}
          >
            {/* Desktop / Tablet: Official Horizontal Logo */}
            <div className="hidden sm:flex items-center">
              <Image
                src="/brand/logo-horizontal-dark.png"
                alt="Ryan Matheus"
                width={240}
                height={48}
                className="brand-logo-light h-10 md:h-11 w-auto transition-transform duration-200 group-hover:scale-[1.03]"
                priority
              />
              <Image
                src="/brand/logo-horizontal-white.png"
                alt="Ryan Matheus"
                width={240}
                height={48}
                className="brand-logo-dark h-10 md:h-11 w-auto transition-transform duration-200 group-hover:scale-[1.03]"
                priority
              />
            </div>

            {/* Mobile: Official Horizontal Logo */}
            <div className="flex sm:hidden items-center">
              <Image
                src="/brand/logo-horizontal-dark.png"
                alt="Ryan Matheus"
                width={190}
                height={38}
                className="brand-logo-light h-8 xs:h-8.5 w-auto transition-transform duration-200 group-hover:scale-105"
                priority
              />
              <Image
                src="/brand/logo-horizontal-white.png"
                alt="Ryan Matheus"
                width={190}
                height={38}
                className="brand-logo-dark h-8 xs:h-8.5 w-auto transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </div>

            <span className="u-label hidden rounded-md bg-[var(--field)] px-2 py-0.5 md:inline" aria-hidden>
              Full-Stack
            </span>
          </HomeLink>

          <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
            <nav aria-label={t('sections')} className="hidden lg:block">
              <ul className="flex items-center gap-6">
                {stations
                  .filter((s) => s.id !== 'top')
                  .map((station) => (
                    <li key={station.id}>
                      <a
                        href={`#${station.id}`}
                        className="u-label text-[0.6875rem] font-medium tracking-[0.14em] text-[var(--ink-2)] transition-colors duration-150 hover:text-[var(--ink)]"
                      >
                        {station.name}
                      </a>
                    </li>
                  ))}
              </ul>
            </nav>

            <LocaleSwitcher label={t('language')} />

            <ThemeToggle />

            {/* Direct WhatsApp CTA Button on Header */}
            <a
              href={whatsappHref('Olá Ryan! Vi seu portfólio e gostaria de iniciar um projeto.')}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 text-xs font-bold transition-all duration-200 shadow-sm hover:shadow hover:scale-105"
            >
              <WhatsApp size={16} />
              <span>WhatsApp</span>
            </a>

            <SheetNav stations={stations} label={t('sections')} />
          </div>
        </div>
      </div>
    </header>
  );
}
