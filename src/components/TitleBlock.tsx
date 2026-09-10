import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { site, whatsappHref } from '@/content/site';
import { localeNames, locales } from '@/i18n/routing';
import { WhatsApp } from '@/components/Icons';

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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)]/60 pb-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo-horizontal-dark.png"
                alt="Ryan Matheus"
                width={240}
                height={48}
                className="brand-logo-light h-9 sm:h-11 md:h-12 w-auto transition-transform duration-200 hover:scale-[1.02]"
              />
              <Image
                src="/brand/logo-horizontal-white.png"
                alt="Ryan Matheus"
                width={240}
                height={48}
                className="brand-logo-dark h-9 sm:h-11 md:h-12 w-auto transition-transform duration-200 hover:scale-[1.02]"
              />
            </div>
            <p className="text-xs text-[var(--ink-3)] font-mono tracking-tight">
              Full-Stack Developer · CRM/ERP, E-commerce, Landing Pages & Portfólios
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={whatsappHref('Olá Ryan! Vi seu portfólio e gostaria de iniciar um projeto.')}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition-all duration-200 hover:bg-emerald-500/20 hover:scale-105"
            >
              <WhatsApp size={16} />
              <span>WhatsApp · {site.links.whatsappDisplay}</span>
            </a>

            <span className="text-xs text-[var(--ink-3)] font-mono tracking-wider hidden sm:inline-block">
              ENG · {site.revision}
            </span>
          </div>
        </div>

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

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--rule)]/60 pt-6">
          <p className="u-tag text-xs text-[var(--ink-3)] normal-case tracking-[0.04em]">
            {site.domain}
          </p>

          <p className="u-tag normal-case tracking-[0.06em]">
            {t('copyright', { year: new Date().getFullYear(), name: site.name })}
          </p>
        </div>
      </div>
    </footer>
  );
}
